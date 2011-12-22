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
    refs:[
          {ref: 'usermanagement',selector: 'usermanagement'} //定义引用，可以通过getXxxx()方法获取
    ],

    init: function() {
		this.control({
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
                change: this.changeButtonState
            },
            
            //角色列表更新事件
            'usermanagement grid':{
                selectionchange: this.changeGridState
            }
	    });
    },
    
    changeButtonState: function(){
//        var form = Ext.getCmp('user-form') ;
        Ext.getCmp('user-form').modifyed=true;
//        if(form.down('button').disable){
//            form.down('button').disable(false);
//        }
    },
    
    changeGridState: function(){
        if(Ext.getCmp('user-grid').inited){
            Ext.getCmp('user-grid').modifyed = true;
        }
    },
    
    //点击树形节点编辑
    selectUserNode: function(node, record){
        var editForm = Ext.getCmp('user-form');
        editForm.uiStatus='Modify';
        this.loadUserRecord(record);
    },
    
    loadUserRecord: function(record){
        var departmentCombobox = Ext.getCmp('user-department-combobox');
        if(record.get('isUser')) {
            departmentCombobox.store.load();
            Ext.widget('userModel').self.load(record.get('id'),{
			    scope: this,
                params:{'whereStr':'id =\''+record.get('id')+'\''},
			    success: function(record, operation) {
                    var editForm = Ext.getCmp('user-form');
                    editForm.getForm().loadRecord(record);
                    this.loadGridRecord(record);
//                    editForm.down('button').disable(true);
			    }
			});
            var formLayout = Ext.getCmp('user-form-layout');
            formLayout.getLayout().setActiveItem(1);
        }
    },
    
    loadGridRecord: function(record){
        var editGrid = Ext.getCmp('user-grid');
        var userOfRoleStore = Ext.create('UserOfRoleStore');
		editGrid.store.load({
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
		                    editGrid.getSelectionModel().select(selectRecords);
		                }
                        editGrid.inited = true;
                    }
                });
		    }
		});
    },
    
    //新增
    addNewRecord: function(button){
        var editForm = Ext.getCmp('user-form');
    	newRecord=Ext.create('SCM.model.system.UserModel');//新增记录
    	var editForm = Ext.getCmp('user-form');
    	editForm.uiStatus='AddNew';
        editForm.getForm().loadRecord(newRecord);
    	this.loadGridRecord(newRecord)
    },
    
    //删除记录
    deleteRecord: function(button){
    	listPanel=button.up('usermanagement');
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
    		listPanel.store.remove(records);
    	}
    },
    //保存记录
    saveRecord: function(button){
    	var form=Ext.getCmp('user-form');
        var editGrid = Ext.getCmp('user-grid');
        var values=form.getValues();
        if(form.modifyed){
	    	var record;
	    	if(form.uiStatus=='Modify'){//修改记录
	            record=form.getRecord();
	            
	    	}else if(form.uiStatus=='AddNew'){//新增记录
	    		record=Ext.create('SCM.model.system.UserModel');
	    	}
	    	record.set(values);
	        record.save();
        }
        if(editGrid.modifyed){
            var userOfRoleStore = Ext.create('UserOfRoleStore');
            var records = editGrid.getSelectionModel().getSelection();
            userOfRoleStore.load({
			    scope : this,
			    roleRecords : records,
                userId : values.userId,
			    params:{'whereStr':'user_id =\''+values.userId+'\''},
			    callback: function(records, operation, success) {
                    debugger;
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
        Ext.Msg.alert("提示信息","保存成功");
        var formLayout = Ext.getCmp('user-form-layout');
        formLayout.getLayout().setActiveItem(0);
    }

});