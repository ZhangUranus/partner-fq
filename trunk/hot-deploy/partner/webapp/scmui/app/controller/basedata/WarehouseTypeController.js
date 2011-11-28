Ext.define('SCM.controller.basedata.WarehouseTypeController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'basedata.warehousetype.ListUI',
        'basedata.warehousetype.EditUI'
    ],
    stores:[
        'basedata.WarehouseTypeStore'
    ],
    refs:[
          {ref: 'warehousetypelist',selector: 'warehousetypelist'}, //定义引用，可以通过getUnitlist()方法获取
          {ref: 'warehousetypeedit',selector: 'warehousetypeedit'}
    ],

    init: function() {
		this.control({
			//列表双击事件
	        'warehousetypelist': {
	    		itemdblclick: this.modifyRecord
	        },
	        //列表新增按钮
	        'warehousetypelist button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //列表修改按钮
	        'warehousetypelist button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        'warehousetypelist button[action=delete]':{
	        	click: this.deleteRecord
	        },
	        //列表刷新按钮
	        'warehousetypelist button[action=refresh]':{
	        	click: this.refreshRecord
	        },
	        
	        //编辑界面保存
	        'warehousetypeedit button[action=save]':{
	        	click: this.saveRecord
	        }
	        
	    });
    },
    
    //双击编辑
    modifyRecord: function(grid, record){
        var editui=Ext.widget('warehousetypeedit');
        editui.uiStatus='Modify';
    	editui.down('form').loadRecord(record);
    },
    //修改
    editRecord: function(button){
    	listPanel=button.up('warehousetypelist');
    	
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
    		var editui=Ext.widget('warehousetypeedit');
    		editui.uiStatus='Modify';
        	editui.down('form').loadRecord(record);
    	}
    },
    //新增
    addNewRecord: function(button){
    	newRecord=Ext.create('WarehouseTypeModel');//新增记录
    	var editui=Ext.widget('warehousetypeedit');
    	editui.uiStatus='AddNew';
    	editui.down('form').loadRecord(newRecord);
    	
    },
    
  //删除记录
    deleteRecord: function(button){
    	listPanel=button.up('warehousetypelist');
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
    		listPanel.store.remove(records);
    	}
    },
  //刷新
    refreshRecord: function(button){
    	listPanel=button.up("warehousetypelist");
    	listPanel.store.load();
    },
    //保存记录
    saveRecord: function(button){
    	//取编辑界面
    	var win=this.getWarehousetypeedit();
    	//取表单
    	form=win.down("form");
    	values=form.getValues();
    	var record;
    	if(win.uiStatus=='Modify'){//修改记录
    		record=form.getRecord();
    		record.set(values);
    	}else if(win.uiStatus=='AddNew'){//新增记录
    		record=Ext.create('WarehouseTypeModel');
    		record.set(values);
    		this.getWarehousetypelist().store.add(record);
    	}
    	
    	
    	win.close();
    }

});