Ext.define('SCM.controller.basedata.CustomerController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'basedata.customer.ListUI',
        'basedata.customer.EditUI'
    ],
    stores:[
        'basedata.CustomerStore'
    ],
    refs:[
          {ref: 'customerlist',selector: 'custinfomaintaince'}, //定义引用，可以通过getUnitlist()方法获取
          {ref: 'customeredit',selector: 'customeredit'}
    ],

    init: function() {
		this.control({
			//列表双击事件
	        'custinfomaintaince': {
	    		itemdblclick: this.modifyRecord
	        },
	        //列表新增按钮
	        'custinfomaintaince button[action=addNew]':{
	        	click: this.addNewRecord
	        },
	        //列表修改按钮
	        'custinfomaintaince button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        'custinfomaintaince button[action=delete]':{
	        	click: this.deleteRecord
	        },
	        //列表刷新按钮
	        'custinfomaintaince button[action=refresh]':{
	        	click: this.refreshRecord
	        },
	        //列表退出按钮
	        'custinfomaintaince button[action=exitList]':{
	        	click: this.exitList
	        },
	        //编辑界面保存
	        'customeredit button[action=save]':{
	        	click: this.saveRecord
	        },
	        //编辑界面删除
	        'customeredit button[action=delete]':{
	        	click: this.deleteRecord
	        },
	        //编辑界面退出
	        'customeredit button[action=exitEdit]':{
	        	click: this.exitEdit
	        }
	    });
    },
    
    //双击编辑
    modifyRecord: function(grid, record){
        var editui=Ext.widget('customeredit');
        editui.uiStatus='Modify';
    	editui.down('form').loadRecord(record);
    },
    //修改
    editRecord: function(button){
    	listPanel=button.up('custinfomaintaince');
    	
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
    		var editui=Ext.widget('customeredit');
    		editui.uiStatus='Modify';
        	editui.down('form').loadRecord(record);
    	}
    },
    //新增
    addNewRecord: function(button){
    	newRecord=Ext.create('CustomerModel');//新增记录
    	var editui=Ext.widget('customeredit');
    	editui.uiStatus='AddNew';
    	editui.down('form').loadRecord(newRecord);
    	
    },
  //删除记录
    deleteRecord: function(button){
    	listPanel=button.up('custinfomaintaince');
    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
    		listPanel.store.remove(records);
    	}
    },
  //刷新
    refreshRecord: function(button){
    	listPanel=button.up("custinfomaintaince");
    	listPanel.store.load();
    },
    //保存记录
    saveRecord: function(button){
    	//取编辑界面
    	var win=this.getCustomeredit();
    	//取表单
    	form=win.down("form");
    	values=form.getValues();
    	var record;
    	if(win.uiStatus=='Modify'){//修改记录
    		record=form.getRecord();
    		record.set(values);
    	}else if(win.uiStatus=='AddNew'){//新增记录
    		record=Ext.create('CustomerModel');
    		record.set(values);
    		this.getCustomerlist().store.add(record);
    	}
    	
    	
    	win.close();
    }

});