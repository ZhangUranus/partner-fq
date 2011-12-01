Ext.define('SCM.controller.system.SystemController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'system.user.ListUI',
        'system.user.EditUI'
    ],
    stores:[
        'system.UserStore'
    ],
    refs:[
          {ref: 'usermanagement',selector: 'usermanagement'}, //定义引用，可以通过getXxxx()方法获取
          {ref: 'usermanagementedit',selector: 'usermanagementedit'}
    ],

    init: function() {
		this.control({
			//列表双击事件
	        'usermanagement': {
	    		itemdblclick: this.modifyRecord
	        },
	        //列表新增按钮
	        'usermanagement button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //列表修改按钮
	        'usermanagement button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        'usermanagement button[action=delete]':{
	        	click: this.deleteRecord
	        },
	        //列表刷新按钮
	        'usermanagement button[action=refresh]':{
	        	click: this.refreshRecord
	        },
	        
	        //编辑界面保存
	        'usermanagementedit button[action=save]':{
	        	click: this.saveRecord
	        }
	        
	    });
    },
    
    //双击编辑
    modifyRecord: function(grid, record){
        var editui=Ext.widget('usermanagementedit');
        editui.uiStatus='Modify';
    	editui.down('form').loadRecord(record);
    },
    //修改
    editRecord: function(button){
    	listPanel=button.up('usermanagement');
    	
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
    		var editui=Ext.widget('usermanagementedit');
    		editui.uiStatus='Modify';
        	editui.down('form').loadRecord(record);
    	}
    },
    //新增
    addNewRecord: function(button){
    	newRecord=Ext.create('UserModel');//新增记录
    	var editui=Ext.widget('usermanagementedit');
    	editui.uiStatus='AddNew';
    	editui.down('form').loadRecord(newRecord);
    	
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
  //刷新
    refreshRecord: function(button){
    	listPanel=button.up("usermanagement");
    	listPanel.store.load();
    },
    //保存记录
    saveRecord: function(button){
    	//取编辑界面
    	var win=this.getUsermanagementedit();
    	//取表单
    	form=win.down("form");
    	values=form.getValues();
    	var record;
    	if(win.uiStatus=='Modify'){//修改记录
    		record=form.getRecord();
    		record.set(values);
    	}else if(win.uiStatus=='AddNew'){//新增记录
    		record=Ext.create('UserModel');
    		record.set(values);
    		this.getUsermanagement().store.add(record);
    	}
    	
    	win.close();
    }

});