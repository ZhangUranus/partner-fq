Ext.define('SCM.controller.basedata.UnitController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'basedata.unit.ListUI',
        'basedata.unit.EditUI'
    ],
    stores:[
        'basedata.UnitStore'
    ],
    refs:[
          {ref: 'unitlist',selector: 'unitlist'}, //定义引用，可以通过getUnitlist()方法获取
          {ref: 'unitedit',selector: 'unitedit'}
    ],

    init: function() {
		this.control({
			//列表双击事件
	        'unitlist': {
	    		itemdblclick: this.modifyRecord
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
	        'unitlist button[action=refresh]':{
	        	click: this.refreshRecord
	        },
	        //列表退出按钮
	        'unitlist button[action=exitList]':{
	        	click: this.exitList
	        },
	        //编辑界面保存
	        'unitedit button[action=save]':{
	        	click: this.saveRecord
	        },
	        //编辑界面删除
	        'unitedit button[action=delete]':{
	        	click: this.deleteRecord
	        },
	        //编辑界面退出
	        'unitedit button[action=exitEdit]':{
	        	click: this.exitEdit
	        }
	    });
    },
    
    //双击编辑
    modifyRecord: function(grid, record){
        var editui=Ext.widget('unitedit');
        editui.uiStatus='Modify';
    	editui.down('form').loadRecord(record);
    },
    //修改
    editRecord: function(button){
    	listPanel=button.up('unitlist');
    	
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
    		var editui=Ext.widget('unitedit');
    		editui.uiStatus='Modify';
        	editui.down('form').loadRecord(record);
    	}
    },
    //新增
    addNewRecord: function(button){
    	newRecord=Ext.create('UnitModel');//新增记录
    	var editui=Ext.widget('unitedit');
    	editui.uiStatus='AddNew';
    	editui.down('form').loadRecord(newRecord);
    	
    },
  //删除记录
    deleteRecord: function(button){
    	listPanel=button.up('unitlist');
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
    		listPanel.store.remove(records);
    	}
    },
  //刷新
    refreshRecord: function(button){
    	listPanel=button.up("unitlist");
    	listPanel.store.load();
    },
    //保存记录
    saveRecord: function(button){
    	//取编辑界面
    	var win=this.getUnitedit();
    	//取表单
    	form=win.down("form");
    	values=form.getValues();
    	var record;
    	if(win.uiStatus=='Modify'){//修改记录
    		record=form.getRecord();
    		record.set(values);
    	}else if(win.uiStatus=='AddNew'){//新增记录
    		record=Ext.create('UnitModel');
    		record.set(values);
    		this.getUnitlist().store.add(record);
    	}
    	
    	
    	win.close();
    }

});