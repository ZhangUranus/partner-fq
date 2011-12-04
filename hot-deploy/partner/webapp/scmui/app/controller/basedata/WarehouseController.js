Ext.define('SCM.controller.basedata.WarehouseController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'basedata.warehouse.ListUI',
        'basedata.warehouse.EditUI'
    ],
    stores:[
        'basedata.WarehouseStore'
    ],
    refs:[
          {ref: 'warehouseinfomaintaince',selector: 'warehouseinfomaintaince'}, //定义引用，可以通过getXxxx()方法获取
          {ref: 'warehouseedit',selector: 'warehouseedit'}
    ],

    init: function() {
		this.control({
			//列表双击事件
	        'warehouseinfomaintaince': {
	    		itemdblclick: this.modifyRecord
	        },
	        //列表新增按钮
	        'warehouseinfomaintaince button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //列表修改按钮
	        'warehouseinfomaintaince button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        'warehouseinfomaintaince button[action=delete]':{
	        	click: this.deleteRecord
	        },
	        //列表刷新按钮
	        'warehouseinfomaintaince button[action=refresh]':{
	        	click: this.refreshRecord
	        },
	        
	        //编辑界面保存
	        'warehouseedit button[action=save]':{
	        	click: this.saveRecord
	        }
	        
	    });
    },
    
    //双击编辑
    modifyRecord: function(grid, record){
        var editui=Ext.widget('warehouseedit');
        editui.uiStatus='Modify';
    	editui.down('form').loadRecord(record);

		//****load完record后需要调整id字段的显示
		editui.down('form').down('[name=wsTypeId]').setValue(record.get('warehouseTypeName'));

    },
    //修改
    editRecord: function(button){
    	listPanel=button.up('warehouseinfomaintaince');
    	
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
    		var editui=Ext.widget('warehouseedit');
    		editui.uiStatus='Modify';
        	editui.down('form').loadRecord(record);
			
			//****load完record后需要调整id字段的显示
			editui.down('form').down('[name=wsTypeId]').setValue(record.get('warehouseTypeName'));


    	}
    },
    //新增
    addNewRecord: function(button){
    	newRecord=Ext.create('WarehouseModel');//新增记录
    	var editui=Ext.widget('warehouseedit');
    	editui.uiStatus='AddNew';
    	editui.down('form').loadRecord(newRecord);
    	
    },
    
  //删除记录
    deleteRecord: function(button){
    	listPanel=button.up('warehouseinfomaintaince');
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
    		listPanel.store.remove(records);
    	}
    },
  //刷新
    refreshRecord: function(button){
    	listPanel=button.up("warehouseinfomaintaince");
    	listPanel.store.load();
    },
    //保存记录
    saveRecord: function(button){
    	//取编辑界面
    	var win=this.getWarehouseedit();
    	//取表单
    	form=win.down("form");
    	values=form.getValues();
    	var record;
    	if(win.uiStatus=='Modify'){//修改记录
    		record=form.getRecord();
    		record.set(values);
    	}else if(win.uiStatus=='AddNew'){//新增记录
    		record=Ext.create('WarehouseModel');
    		record.set(values);
    		this.getWarehouseinfomaintaince().store.add(record);
    	}
    	
    	win.close();
    	//this.getWarehouseinfomaintaince().store.load();//保存后刷新页面
    }

});