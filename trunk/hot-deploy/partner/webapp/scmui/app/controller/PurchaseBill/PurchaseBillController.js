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
		{ref: 'PurchaseBilllist',selector: 'PurchaseBilllist gridpanel[region=center]'},
		{ref: 'PurchaseBilllistentry',selector: 'PurchaseBilllist gridpanel[region=south]'},
		{ref: 'PurchaseBilledit',selector: 'PurchaseBilledit'},
		{ref: 'PurchaseBilleditentry',selector: 'PurchaseBilledit gridpanel'}
	],
	requires:['SCM.model.PurchaseBill.PurchaseBillActionModel'],
	
    init: function() {
		this.control({
			
	        //分录列表初始化后
	        'PurchaseBilllist gridpanel[region=south]':{
	        	afterrender: this.initPurchaseBilllistentry
	        },
			//列表新增按钮
	        'PurchaseBilllist button[action=addNew]':{
	        	click: this.addNewRecord
	        },
			//列表事件
	        'PurchaseBilllist gridpanel[region=center]': {
	        	afterrender: this.initPurchaseBilllist //列表初始化事件
	    		,select: this.showDetail //列表选择事件，显示明细
	        },
	        //列表修改按钮
	        'PurchaseBilllist button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        'PurchaseBilllist button[action=delete]':{
	        	click: this.deleteRecord
	        },
			//列表界面刷新
			'PurchaseBilllist button[action=refresh]':{
	        	click: this.refresh
	        },
	        //列表审核按钮
	        'PurchaseBilllist button[action=audit]':{
	        	click: this.auditBill
	        },
	        //列表反审核按钮
	        'PurchaseBilllist button[action=unaudit]':{
	        	click: this.unauditBill
	        },
	        //列表打印按钮
	        'PurchaseBilllist button[action=print]':{
	        	click: this.print
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
			//编辑界面供应商字段选择界面确定
			,'#PurchaseBillform-supplierSupplierId-selWin button[name=btnSure]':{
				click: this.selectsupplierSupplier
			}
			//编辑界面供应商字段选择界面取消
			,'#PurchaseBillform-supplierSupplierId-selWin button[name=btnCancel]':{
				click: cancelSelWin
			}
									//\n
			//编辑界面采购员字段选择界面确定
			,'#PurchaseBillform-purchserTSystemUserId-selWin button[name=btnSure]':{
				click: this.selectpurchserTSystemUser
			}
			//编辑界面采购员字段选择界面取消
			,'#PurchaseBillform-purchserTSystemUserId-selWin button[name=btnCancel]':{
				click: cancelSelWin
			}
									//\n
			//编辑界面审核员字段选择界面确定
			,'#PurchaseBillform-auditerTSystemUserId-selWin button[name=btnSure]':{
				click: this.selectauditerTSystemUser
			}
			//编辑界面审核员字段选择界面取消
			,'#PurchaseBillform-auditerTSystemUserId-selWin button[name=btnCancel]':{
				click: cancelSelWin
			}
																		//\n
			//编辑界面分录物料字段选择界面确定
			,'#PurchaseBillform-materialMaterialName-selWin button[name=btnSure]':{
				click: this.selectmaterialMaterial
			}
			//编辑界面分录物料字段选择界面取消
			,'#PurchaseBillform-materialMaterialName-selWin button[name=btnCancel]':{
				click: cancelSelWin
			}
															//\n
			//编辑界面分录单位字段选择界面确定
			,'#PurchaseBillform-unitUnitName-selWin button[name=btnSure]':{
				click: this.selectunitUnit
			}
			//编辑界面分录单位字段选择界面取消
			,'#PurchaseBillform-unitUnitName-selWin button[name=btnCancel]':{
				click: cancelSelWin
			}
																								//\n

		}
		);
    },
	
    //初始化列表
    initPurchaseBilllist : function(grid){
    	this.mainGrid=grid;
    	//grid.store.proxy.addListener('afterRequest',this.afterRequest,this);		//监听所有请求回调
    },
    //初始化分录列表
    initPurchaseBilllistentry : function(grid){
    	this.entryGrid=grid;
    	//grid.store.proxy.addListener('afterRequest',this.afterEntryRequest,this);		//监听所有请求回调
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
    		//如果单据状态是审核或者已经结算则不能修改
    		if(record.data.status=='1'||record.data.status=='3'){
    			showError('单据不能修改');
    		}else{
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
		}else{
    		showError('请选择记录!');
    	}
		
	},
	//显示分录信息
	showDetail: function(me, record,index,eOpts){
		if(record!=null&&record.get("id")!=null){
			var entryStore=this.getPurchaseBilllistentry().store;
			if(entryStore!=null){
				entryStore.clearFilter(true);
				entryStore.filter([{property: "parentId", value: record.data.id}]);
				entryStore.load();
			}
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
    		for(i in records){
    			if(records[i].data.status=='1'||records[i].data.status=='3'){
    				showError('单据不能删除');
    				return ;
    			}
    		}
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
    	}else{
    		showError('请选择记录!');
    	}
	},
	//刷新
	refresh: function(button){
		var listPanel=this.getPurchaseBilllist();
    	listPanel.store.load();
    	
    	var entryPanel=this.getPurchaseBilllistentry();
    	entryPanel.store.removeAll();
	},
	auditBill: function(button){
		listPanel=this.getPurchaseBilllist();
    	sm=listPanel.getSelectionModel();
		
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
			Ext.Ajax.request({
			scope:this,
		    url: '../../scm/control/auditBill?billId='+record.data.id+'&entity=PurchaseBill',
		    success: function(response){
		         this.refresh();
		    }
		});
		}else{
    		showError('请选择记录!');
    	}
		
		
	},
	unauditBill: function(button){
		listPanel=this.getPurchaseBilllist();
    	sm=listPanel.getSelectionModel();
		
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
			Ext.Ajax.request({
			scope:this,
		    url: '../../scm/control/unauditBill?billId='+record.data.id+'&entity=PurchaseBill',
		    success: function(response){
		        this.refresh();
		    }
		});
		}else{
    		showError('请选择记录!');
    	}
	},
	//打印单据
	print : function(button){
//		var printer=Ext.create('Ext.ux.PrintWindow');
//		printer.show();
		var printWin=window.open('','printwin');
		printWin.document.write(this.getPrintContent());
	    printWin.document.close();
	    printWin.print();
	    printWin.close();
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
	//表头供应商选择框保存
	,selectsupplierSupplier:function(button){
		var edit=this.getPurchaseBilledit();
		var form=edit.down('form');
		selectValwin(button,'supplierSupplierId',form);
	}
			//\n
	//表头采购员选择框保存
	,selectpurchserTSystemUser:function(button){
		var edit=this.getPurchaseBilledit();
		var form=edit.down('form');
		selectValwin(button,'purchserTSystemUserId',form);
	}
			//\n
	//表头审核员选择框保存
	,selectauditerTSystemUser:function(button){
		var edit=this.getPurchaseBilledit();
		var form=edit.down('form');
		selectValwin(button,'auditerTSystemUserId',form);
	}
						//\n
	//表体物料选择框保存
	,selectmaterialMaterial:function(button){
		var sr=this.getSelectedEntry();
		selectValIdAName(button,'materialMaterialId','materialMaterialName',sr);
	}
					//\n
	//表体单位选择框保存
	,selectunitUnit:function(button){
		var sr=this.getSelectedEntry();
		selectValIdAName(button,'unitUnitId','unitUnitName',sr);
	}
								//\n
	//调整显示字段，将id字段值设置为displayValue字段值
	,ajustId2Display : function(form,record){
		//示例代码
		//var material=form.down('selectorfield[name=materialId]');
		//material.displayValue=record.get('materialName');//默认物料
				//\n
		var supplierSupplier=form.down('selectorfield[name=supplierSupplierId]');
		supplierSupplier.displayValue=record.get('supplierSupplierName');
						//\n
		var purchserTSystemUser=form.down('selectorfield[name=purchserTSystemUserId]');
		purchserTSystemUser.displayValue=record.get('purchserTSystemUserName');
						//\n
		var auditerTSystemUser=form.down('selectorfield[name=auditerTSystemUserId]');
		auditerTSystemUser.displayValue=record.get('auditerTSystemUserName');
								
	},
	
	//列表请求回调
	afterRequest: function(){
		
	},
	//分录列表请求回调
	afterEntryRequest: function(){
		
	},
	getPrintContent: function(){
		return 'test';
	}

});