Ext.define('SCM.controller.PurchaseBill.PurchaseBillController', {
    extend: 'Ext.app.Controller',
    
	views: [
        'PurchaseBill.ListUI',
		'PurchaseBill.EditUI'
    ],
	
	stores:[
		'PurchaseBill.PurchaseBillStore',
		'PurchaseBill.PurchaseBillEditStore',
		'PurchaseBill.PurchaseBillEditEntryStore'
	],
	refs:[
		{ref: 'PurchaseBilllist',selector: 'PurchaseBilllist gridpanel'},
		{ref: 'PurchaseBilledit',selector: 'PurchaseBilledit'},
		{ref: 'PurchaseBilleditentry',selector: 'PurchaseBilledit gridpanel'}
	],
	requires:['SCM.model.PurchaseBill.PurchaseBillActionModel'],
	
    init: function() {
		this.control({
			//列表新增按钮
	        'PurchaseBilllist button[action=addNew]':{
	        	click: this.addNewRecord
	        },
			//列表双击事件
	        'PurchaseBilllist gridpanel': {
	    		itemdblclick: this.editRecord
	        },
	        //列表修改按钮
	        'PurchaseBilllist  button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        'PurchaseBilllist  button[action=delete]':{
	        	click: this.deleteRecord
	        },
			//列表界面刷新
			'PurchaseBilllist button[action=refresh]':{
	        	click: this.refresh
	        },
			//编辑界面分录新增
	        'PurchaseBilledit  gridpanel button[action=addLine]':{
	        	click: this.addLine
	        },
			//编辑界面分录删除
	        'PurchaseBilledit  gridpanel button[action=deleteLine]':{
	        	click: this.deleteLine
	        },
			
			//编辑界面保存
			'PurchaseBilledit button[action=save]':{
				click: this.saveRecord
			}
																								//\n
			//编辑界面自定义字段4字段选择界面确定
			,'#PurchaseBillform-myfield4UnitId-selWin button[name=btnSure]':{
				click: this.selectmyfield4Unit
			}
			//编辑界面自定义字段4字段选择界面取消
			,'#PurchaseBillform-myfield4UnitId-selWin button[name=btnCancel]':{
				click: cancelSelWin
			}
																																				//\n
			//编辑界面分录自定义字段4字段选择界面确定
			,'#PurchaseBillform-myentryfield4UnitName-selWin button[name=btnSure]':{
				click: this.selectmyentryfield4Unit
			}
			//编辑界面分录自定义字段4字段选择界面取消
			,'#PurchaseBillform-myentryfield4UnitName-selWin button[name=btnCancel]':{
				click: cancelSelWin
			}
																		//\n

		}
		);
    },

	//新增
    addNewRecord: function(button){
    	newRecord=Ext.create('PurchaseBillEditModel');//新增记录
    	var editui=Ext.widget('PurchaseBilledit');
    	editui.uiStatus='AddNew';
		var form=editui.down('form');
    	form.loadRecord(newRecord);
		//清空分录
		grid=form.down('gridpanel');
		grid.store.removeAll(true);

    },
	//修改记录
	editRecord: function(){
		listPanel=this.getPurchaseBilllist();
    	sm=listPanel.getSelectionModel();
		
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
			//根据选择的id加载编辑界面数据
			var editStore=Ext.create('PurchaseBillEditStore');
			editStore.filter([{property: "id", value: record.data.id}]);
			editStore.load({
				scope   : this,
				callback: function(records, operation, success) {
					
					var editUI=Ext.widget('PurchaseBilledit');
					editUI.uiStatus='Modify';
					var form=editUI.down('form');
					this.ajustId2Display(form,records[0]);
    				form.loadRecord(records[0]);
					var entryStore=editUI.down('gridpanel').store;
					entryStore.removeAll();//清除记录
					entryStore.filter([{property: "parentId", value: records[0].id}]);//过滤记录
					entryStore.load();
				}
			});
		}
		
	},
	//删除记录
	deleteRecord: function(){
		listPanel=this.getPurchaseBilllist();
		//清除新增标记
		newRecords=listPanel.store.getNewRecords();
		for(i in newRecords){
				newRecords[i].phantom=false;
		}

    	sm=listPanel.getSelectionModel();
    	if(sm.hasSelection()){//判断是否选择行记录
    		//删除选择的记录
    		records=sm.getSelection();
			
    		listPanel.store.remove(records);
			listPanel.store.proxy.afterRequest=function(request,success){
				if(request.action=='destroy'){
					var store = Ext.data.StoreManager.lookup('PurchaseBill.PurchaseBillStore');
					if(store!=null){
						store.load();//刷新界面
					}
				}
			};
			listPanel.store.sync();
    	}
	},
	//刷新
	refresh: function(button){
		listPanel=this.getPurchaseBilllist();
    	listPanel.store.load();
	},
    //保存记录
	saveRecord: function(button){
		//取编辑界面
    	var win=this.getPurchaseBilledit();
    	//取表单
    	form=win.down('form');
    	values=form.getValues();

    	var head;
    	if(win.uiStatus=='Modify'){//修改记录
    		head=form.getRecord();
			head.set(values);
			var entryStore=this.getPurchaseBilleditentry().store;
			
			//新建一个复合model
			var oneEntryModel=Ext.create('PurchaseBillActionModel');
			
			var removed = entryStore.getRemovedRecords();   
			var updated = entryStore.getUpdatedRecords();   
			var newed = entryStore.getNewRecords(); 
			if(head.dirty||removed.length>0||updated.length>0||newed.length>0){
				oneEntryModel=processOneEntryModel(oneEntryModel,head,entryStore);
				oneEntryModel.save();
			}
			
    	}else if(win.uiStatus=='AddNew'){//新增记录
		    
    		head=Ext.create('PurchaseBillEditModel');
    		head.set(values);
			var entryGrid=this.getPurchaseBilleditentry();
			
			//新建一个复合model
			var oneEntryModel=Ext.create('PurchaseBillActionModel');
			
			oneEntryModel=processOneEntryModel(oneEntryModel,head,entryGrid.store);

			oneEntryModel.save();

    	}
    	
    	win.close();
		this.refresh();
		
		
	},
	//新增分录
	addLine:function(button){
		var entryRecord=Ext.create('PurchaseBillEditEntryModel');
		var grid=button.up('gridpanel');
		var form=grid.up('form');

		//设置父id
		entryRecord.set('parentId',form.getValues().id);
		grid.store.add(entryRecord);
	},
	//删除分录
	deleteLine:function(button){
		var grid=button.up('gridpanel');
		grid.store.remove(this.getSelectedEntry());
	},
	//获取选择的分录行
	getSelectedEntry: function(){
		var grid=this.getPurchaseBilleditentry();
		var selMod= grid.getSelectionModel();
		if(selMod!=null){
			 return selMod.getLastSelected();
		}
	}
								//\n
	//表头选择框保存
	,selectmyfield4Unit:function(button){
		var edit=this.getPurchaseBilledit();
		var form=edit.down('form');
		selectValwin(button,'myfield4UnitId',form);
	}
												//\n
	//表头选择框保存
	,selectmyentryfield4Unit:function(button){
		var sr=this.getSelectedEntry();
		selectValIdAName(button,'myentryfield4UnitId','myentryfield4UnitName',sr);
	}
						//\n
	//调整显示字段，将id字段值设置为displayValue字段值
	,ajustId2Display : function(form,record){
		//示例代码
		//var material=form.down('selectorfield[name=materialId]');
		//material.displayValue=record.get('materialName');//默认物料
																//\n
		var myfield4Unit=form.down('selectorfield[name=myfield4UnitId]');
		myfield4Unit.displayValue=record.get('myfield4UnitName');
								
	}
	

});