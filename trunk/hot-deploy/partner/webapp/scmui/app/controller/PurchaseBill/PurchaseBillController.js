Ext.define('SCM.controller.PurchaseBill.PurchaseBillController', {
    extend: 'Ext.app.Controller',
    mixins:['SCM.extend.controller.BillCommonController'],
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
	editName:'PurchaseBilledit',
	editStoreName:'PurchaseBillEditStore',
	modelName:'PurchaseBillEditModel',
	entryModelName:'PurchaseBillEditEntryModel',
	
    init: function() {
		this.control({
			'PurchaseBilllist':{
	        	afterrender: this.initComponent
	        },
			//列表新增按钮
	        'PurchaseBilllist button[action=addNew]':{
	        	click: this.addNewRecord
	        },
			//列表事件
	        'PurchaseBilllist gridpanel[region=center]': {
	    		select: this.showDetail //列表选择事件，显示明细
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
	        	click: this.refreshRecord
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
		}
		);
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

	auditBill: function(button){
		listPanel=this.getPurchaseBilllist();
    	sm=listPanel.getSelectionModel();
		
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
			Ext.Ajax.request({
			scope:this,
		    url: '../../scm/control/auditBill?billId='+record.data.id+'&entity=PurchaseBill',
		    success: function(response){
		         this.refreshRecord();
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
		        this.refreshRecord();
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
		this.refreshRecord();
		
		
	},
	getPrintContent: function(){
		return 'test';
	}

});