Ext.define('SCM.controller.system.SystemController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'system.user.ListUI'
    ],
    stores:[
        'system.RoleStore',
        'system.UserTreeStore',
        'system.UserOfRoleStore'
    ],
    models: ['system.UserTreeModel','system.UserModel'],
    refs:[//定义引用，可以通过getXxxx()方法获取
          {ref: 'usermanagement',selector: 'usermanagement'}
    ],

    init: function() {
		this.control({
            //树形节点单击事件
            'usermanagement': {
                afterrender: this.initList
            },
			//树形节点单击事件
	        'usermanagement treepanel': {
	    		itemclick: this.selectUserNode
	        },
	        //列表新增按钮
	        'usermanagement button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //列表删除按钮
	        'usermanagement button[action=delete]':{
	        	click: this.deleteRecord
	        },
	        
	        //编辑界面保存
	        'usermanagement form button[action=save]':{
	        	click: this.saveRecord
	        },
            
            'usermanagement form textfield':{
                change: this.textFieldchange
            },
            
            //角色列表更新事件
            'usermanagement grid':{
                selectionchange: this.gridChange
            }
	    });
    },
    
    initList: function(view){
        this.selectUser = false;
        this.userView = view;
        this.userForm = view.down('form');
        this.userGrid = view.down('gridpanel');
        this.userTree = view.down('treepanel');
        this.newButton = view.down('button[action=addNew]');
        this.deleteButton = view.down('button[action=delete]');
        this.saveButton = view.down('button[action=save]');
        var departmentCombobox = Ext.getCmp('user-department-combobox');
        departmentCombobox.store.load();
        this.changeComponentsState();
    },
    
    changeComponentsState: function(){
        if(this.userView.permission.add){
            this.newButton.setDisabled(false);
        }else{
            this.newButton.setDisabled(true);
        }
        if(this.userView.permission.remove && this.selectUser){
            this.deleteButton.setDisabled(false);
        }else{
            this.deleteButton.setDisabled(true);
        }
        if(this.userForm.uiStatus=='AddNew'){
            this.saveButton.setDisabled(false);
            this.userGrid.setDisabled(false);
            this.userForm.getForm().findField('userId').setReadOnly(false);
            this.changeFormFieldState(this.userForm,false);
        }else{
            this.userForm.getForm().findField('userId').setReadOnly(true);
            if(this.userView.permission.edit){
                this.saveButton.setDisabled(false);
                this.userGrid.setDisabled(false);
                this.changeFormFieldState(this.userForm,false);
            }else{
                this.saveButton.setDisabled(true);
                this.userGrid.setDisabled(true);
                this.changeFormFieldState(this.userForm,true);
            }
        }
    },
    
    changeFormFieldState: function(form,readOnly){
        form.getForm().findField('password').setReadOnly(readOnly);
		form.getForm().findField('passwordComfirm').setReadOnly(readOnly);
		form.getForm().findField('userName').setReadOnly(readOnly);
		form.getForm().findField('sex').setReadOnly(readOnly);
		form.getForm().findField('departmentId').setReadOnly(readOnly);
		form.getForm().findField('position').setReadOnly(readOnly);
		form.getForm().findField('phoneNumber').setReadOnly(readOnly);
		form.getForm().findField('email').setReadOnly(readOnly);
		form.getForm().findField('valid').setReadOnly(readOnly);
    },
    
    textFieldchange: function(textField,newValue,oldValue){
        if(this.userForm.inited && !this.userForm.modifyed){
            this.userForm.modifyed = true;
        }
    },
    
    gridChange: function(){
        if(this.userGrid.inited && !this.userGrid.modifyed){
            this.userGrid.modifyed = true;
        }
    },
    
    //点击树形节点编辑
    selectUserNode: function(node, record){
        this.selectUser = record.get('isUser');
        var me =this;
        if(this.userForm.modifyed || this.userGrid.modifyed){
            Ext.Msg.confirm('提示','确定退出当前用户编辑窗口？',confirmChange);
            function confirmChange(id){
                if(id=='yes'){
                    if(me.selectUser) {
			            me.loadUserRecord(record);
			        }
                }
            }
        }else{
            if(me.selectUser) {
                me.loadUserRecord(record);
            }
        }
        me.changeComponentsState();
    },
    
    loadUserRecord: function(record){
        this.userForm.uiStatus='Modify';
        this.initEditState();
        Ext.widget('userModel').self.load(record.get('id'),{
            scope: this,
            params:{'whereStr':'id =\''+record.get('id')+'\''},
            success: function(record, operation) {
                this.userForm.getForm().loadRecord(record);
                this.loadGridRecord(record);
                this.userForm.inited = true;
            }
        });
    },
    
    initEditState: function(){
        this.userForm.inited = false;
        this.userGrid.inited = false;
        this.userForm.modifyed = false;
        this.userGrid.modifyed = false;
    },
    
    loadGridRecord: function(record){
        var me = this;
        var userOfRoleStore = Ext.create('UserOfRoleStore');
		this.userGrid.store.load({
		    scope   : this,
		    userid : record.get('userId'),
		    callback: function(records, operation, success) {
                userOfRoleStore.load({
                    scope : this,
                    roleRecords : records,
                    params:{'whereStr':'user_id =\''+operation.userid+'\''},
                    callback: function(records, operation, success) {
                        var selectRecords = [];
		                for(var i in operation.roleRecords){
                            for(var j in records){
			                    if(operation.roleRecords[i].get('roleId')==records[j].get('roleId')){
			                        selectRecords.push(operation.roleRecords[i]);
			                    }
                            }
		                }
		                if(selectRecords.length>0){
		                    me.userGrid.getSelectionModel().select(selectRecords);
		                }
                        me.userGrid.inited = true;
                    }
                });
		    }
		});
        Ext.getCmp('user-form-layout').getLayout().setActiveItem(1);
    },
    
    //新增
    addNewRecord: function(button){
        this.initEditState();
    	newRecord=Ext.create('SCM.model.system.UserModel');//新增记录
        if(this.userTree.getSelectionModel().getLastSelected()!=null ){
            if(!this.userTree.getSelectionModel().getLastSelected().get('isUser')){
                newRecord.set('departmentId',this.userTree.getSelectionModel().getLastSelected().get('id'));
            }else{
                newRecord.set('departmentId',this.userTree.getSelectionModel().getLastSelected().parentNode.get('id'));
            }
        }
    	this.userForm.uiStatus='AddNew';
        this.userForm.getForm().loadRecord(newRecord);
        this.userForm.inited = true;
    	this.loadGridRecord(newRecord)
        this.changeComponentsState();
    },
    
    //删除记录
    deleteRecord: function(button){
        var me =this;
    	sm=me.userTree.getSelectionModel();
    	if(sm.hasSelection() && me.selectUser){//判断是否选择行记录，而且选中用户节点
    		//删除选择的记录
    		record=sm.getLastSelected();
            Ext.Msg.confirm('提示','确定删除【'+record.get('text')+'】用户？',confirmChange);
	        function confirmChange(id){
	            if(id=='yes'){
                    var user=Ext.create('SCM.model.system.UserModel');
                    user.set('id',record.get('id'));
                    user.destroy();
                    Ext.Msg.alert("提示","删除成功",callBack);
			        function callBack(){
			            Ext.getCmp('user-form-layout').getLayout().setActiveItem(0);
                        me.initEditState();
			            me.refreshTree();
			        }
	            }
	        }
    	}
    },
    //保存记录
    saveRecord: function(button){
        var me = this;
        var values=me.userForm.getValues();
        if(me.userForm.modifyed){
	    	var record;
	    	if(me.userForm.uiStatus=='Modify'){//修改记录
	            record=me.userForm.getRecord();
	            
	    	}else if(me.userForm.uiStatus=='AddNew'){//新增记录
	    		record=Ext.create('SCM.model.system.UserModel');
	    	}
	    	record.set(values);
	        record.save();
        }
        if(this.userGrid.modifyed){
            var userOfRoleStore = Ext.create('UserOfRoleStore');
            var records = me.userGrid.getSelectionModel().getSelection();
            userOfRoleStore.load({
			    scope : this,
			    roleRecords : records,
                userId : values.userId,
			    params:{'whereStr':'user_id =\''+values.userId+'\''},
			    callback: function(records, operation, success) {
                    var newRecords = Ext.create('UserOfRoleStore');
                    var rs = [];
                    for(var i in operation.roleRecords){
                        rs.push({userId: operation.userId , roleId: operation.roleRecords[i].get('roleId')});
                    }
                    newRecords.loadData(records);
                    newRecords.remove(records);
                    newRecords.add(rs)
                }
			});
        }
        Ext.Msg.alert("提示信息","保存成功",callBack);
        function callBack(){
            Ext.getCmp('user-form-layout').getLayout().setActiveItem(0);
            me.initEditState();
            me.refreshTree();
        }
    },
    
    refreshTree : function(){
        this.userTree.store.load();
    }

});