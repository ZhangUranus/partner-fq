Ext.define('SCM.controller.basedata.UnitController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'basedata.unit.ListUI',
        'basedata.unit.EditUI'
    ],
    stores:[
        'basedata.UnitStore'
    ],
//    refs:[
//          {ref: 'unitlist',selector: 'unitlist'}, //定义引用，可以通过getUnitlist()方法获取
//          {ref: 'unitedit',selector: 'unitedit'}
//    ],

    init: function() {
		this.control({
	        'unitlist': {
	        	afterrender: this.initComponent,		//在界面完成初始化后调用
	    		itemdblclick: this.modifyRecord,		//双击列表，弹出编辑界面
                itemclick: this.changeComponentsState	//点击列表，改变修改、删除按钮状态
	        },
	        //列表新增按钮
	        'unitlist button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //列表修改按钮
	        'unitlist button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        'unitlist button[action=delete]':{
	        	click: this.deleteRecord
	        },
	        //列表刷新按钮
	        'unitlist button[action=search]':{
	        	click: this.refreshRecord
	        },
	        //编辑界面保存
	        'unitedit button[action=save]':{
	        	click: this.saveRecord
	        },
	        
	        'unitedit form textfield':{
                change: this.fieldChange
            }
//            //焦点离开文本框时调用
//            'unitedit form textfield[name=name]':{
//                blur: this.fieldValidate
//            }
	    });
    },
    
    initComponent: function(grid){
        this.listPanel = grid;
        this.newButton = grid.down('button[action=addNew]');
        this.deleteButton = grid.down('button[action=delete]');
        this.editButton = grid.down('button[action=modify]');
        this.searchText = grid.down('textfield[id=keyWord]');
        this.initUnitedit();
        this.editForm = this.win.down('form');
        this.saveButton = this.win.down('button[action=save]');
        this.searchText.focus(true,true);			//设置界面初始焦点到搜索输入框
        this.listPanel.store.proxy.addListener('afterRequest',this.afterRequest,this);		//监听所有请求回调
        this.initPermission();
        this.changeComponentsState();
        var pageMap = new Ext.util.KeyMap(Ext.getDoc(), [//当前页面注册确定按钮事件
        	{
        		scope : this,
		        key: Ext.EventObject.ENTER,
		        fn: this.clickEnter
		    }
		]);
		var searchMap = new Ext.util.KeyMap(this.searchText.getEl(), [//搜索框需要单独注册确定按钮事件
        	{
        		scope : this,
		        key: Ext.EventObject.ENTER,
		        fn: this.clickEnter
		    }
		]);
    },
    
    initUnitedit: function(){//初始化编辑框
        if(!this.win){
            this.win = Ext.widget('unitedit');
        }
    },
    
    /**
     * @param {} request.action : read,create,update,destroy
     * @param {} success : true,false
     */
    afterRequest: function(request,success){
    	if(success && request.operation.success){
	    	if(request.action=='read'){
	    		
	    	}else if(request.action=='create'){
	    		this.refreshRecord();
	    	}else if(request.action=='update'){
	    		this.refreshRecord();
	    	}else if(request.action=='destroy'){
	    	}
	    	if(this.win.isVisible()){
	    		this.win.close();
	    	}
    	}else{
			//不需要处理，由服务器抛出异常即可
    	}
    },
    
	initPermission: function(){
        if(this.listPanel.permission.add){
            this.newButton.setVisible(true);
        }else{
            this.newButton.setVisible(false);
        }
        if(this.listPanel.permission.edit ){
            this.editButton.setVisible(true);
        }else{
            this.editButton.setVisible(false);
        }
        if(this.listPanel.permission.remove ){
            this.deleteButton.setVisible(true);
        }else{
            this.deleteButton.setVisible(false);
        }
        
        
    },
    
	changeComponentsState: function(){
        if(this.listPanel.getSelectionModel().hasSelection()){
            this.deleteButton.setDisabled(false);
            this.editButton.setDisabled(false);
        }else{
            this.deleteButton.setDisabled(true);
            this.editButton.setDisabled(true);
        }
        if(this.win.uiStatus=='AddNew'){
            this.saveButton.setVisible(true);
        }else{
            if(this.listPanel.permission.edit){
                this.saveButton.setVisible(true);
                this.editForm.getForm().findField('name').setReadOnly(false);
            }else{
                this.saveButton.setVisible(false);
                this.editForm.getForm().findField('name').setReadOnly(true);
            }
        }
    },
    
    clickEnter: function(){
    	if(this.win.isVisible()){
    		this.saveRecord();
    	}else{
    		this.refreshRecord();
    	}
    },
    
    fieldChange: function(textField,newValue,oldValue){
        if(this.win.inited && !this.win.modifyed){
            this.win.modifyed = true;
        }
    },
    
//    异步验证
//    fieldValidate:function(field){
//        var tempStore = Ext.create('UnitStore');
//        tempStore.load({
//            scope: this,
//            params:{'whereStr':'name =\''+field.getValue()+'\''},
//            callback: function(record, operation) {
//                debugger;
//                if(record.length>0){
//                    field.setActiveError('错误');
//                }
//            }
//        });
//    },
    showEdit: function(){
        this.win.show();
        this.changeComponentsState();
        this.win.inited = true;
        this.editForm.getForm().findField('name').focus(true,true);
    },
    
    //双击编辑
    modifyRecord: function(grid, record){
        this.win.uiStatus='Modify';
    	this.editForm.loadRecord(record);
    	this.nameFieldOldValue = record.get('name');
        this.showEdit();
    },
    //修改
    editRecord: function(button){
    	sm=this.listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
    		this.modifyRecord(this.listPanel,record);
    	}
    },
    //新增
    addNewRecord: function(button){
    	newRecord=Ext.create('UnitModel');//新增记录
    	this.win.uiStatus='AddNew';
    	this.editForm.loadRecord(newRecord);
    	this.showEdit();
    },
  	//删除记录
    deleteRecord: function(button){
    	sm=this.listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
            Ext.Msg.confirm('提示','确定删除该计量单位？',confirmChange,this);
            function confirmChange(id){
                if(id=='yes'){
                    this.listPanel.store.remove(records);
                    Ext.Msg.alert("提示","删除成功");
                    this.refreshRecord();
                }
            }
    	}
    },
	//刷新
    refreshRecord: function(button){
    	if(this.searchText.getValue()){
    		this.listPanel.store.getProxy().extraParams.whereStr = 'name like \'%'+this.searchText.getValue()+'%\'';
    	}else{
    		this.listPanel.store.getProxy().extraParams.whereStr = '';
    	}
    	this.listPanel.store.load();
    	this.changeComponentsState();
    },
    //保存记录
    saveRecord: function(button){
    	values=this.editForm.getValues();
    	if(this.win.uiStatus=='Modify' && !this.win.modifyed){//用户未做任何修改，直接关闭编辑框
    		this.win.close();
    		return ;
    	}
    	var record;
		if(this.win.uiStatus=='Modify'){//修改记录
		    record=this.editForm.getRecord();
		    record.set(values);
		}else if(this.win.uiStatus=='AddNew'){//新增记录
		    record=Ext.create('UnitModel');
		    record.set(values);
		    if(this.listPanel.store.indexOf(this.oldRecord) != -1){//避免重复添加
		    	this.listPanel.store.remove(this.oldRecord);
		    }
		    this.oldRecord = record;	
		    this.listPanel.store.add(record);
		    
		}
		this.changeComponentsState();
    }
});