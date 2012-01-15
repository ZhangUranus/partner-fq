Ext.define('SCM.controller.${TemplateName}.${TemplateName}Controller', {
    extend: 'Ext.app.Controller',
    mixins:['SCM.extend.controller.BillCommonController'],
	views: [
        '${TemplateName}.ListUI',
		'${TemplateName}.EditUI'
    ],
	
	stores:[
		'${TemplateName}.${TemplateName}Store',
		'${TemplateName}.${TemplateName}EditStore',
		'${TemplateName}.${TemplateName}EditEntryStore'
	],
	refs:[
		{ref: '${TemplateName}list',selector: '${TemplateName}list gridpanel[region=center]'},
		{ref: '${TemplateName}listentry',selector: '${TemplateName}list gridpanel[region=south]'},
		{ref: '${TemplateName}edit',selector: '${TemplateName}edit'},
		{ref: '${TemplateName}editentry',selector: '${TemplateName}edit gridpanel'}
	],
	requires:['SCM.model.${TemplateName}.${TemplateName}ActionModel'],
	editName:'${TemplateName}edit',
	editStoreName:'${TemplateName}EditStore',
	modelName:'${TemplateName}EditModel',
	entryModelName:'${TemplateName}EditEntryModel',
	
    init: function() {
		this.control({
			'${TemplateName}list':{
	        	afterrender: this.initComponent
	        },
			//列表新增按钮
	        '${TemplateName}list button[action=addNew]':{
	        	click: this.addNewRecord
	        },
			//列表事件
	        '${TemplateName}list gridpanel[region=center]': {
	    		select: this.showDetail //列表选择事件，显示明细
	        },
	        //列表修改按钮
	        '${TemplateName}list button[action=modify]':{
	        	click: this.editRecord
	        },
	        //列表删除按钮
	        '${TemplateName}list button[action=delete]':{
	        	click: this.deleteRecord
	        },
			//列表界面刷新
			'${TemplateName}list button[action=refresh]':{
	        	click: this.refreshRecord
	        },
	        //列表审核按钮
	        '${TemplateName}list button[action=audit]':{
	        	click: this.auditBill
	        },
	        //列表反审核按钮
	        '${TemplateName}list button[action=unaudit]':{
	        	click: this.unauditBill
	        },
	        //列表打印按钮
	        '${TemplateName}list button[action=print]':{
	        	click: this.print
	        },
			//编辑界面分录新增
	        '${TemplateName}edit  gridpanel button[action=addLine]':{
	        	click: this.addLine
	        },
			//编辑界面分录删除
	        '${TemplateName}edit  gridpanel button[action=deleteLine]':{
	        	click: this.deleteLine
	        },
			
			//编辑界面保存
			'${TemplateName}edit button[action=save]':{
				click: this.saveRecord
			}
		}
		);
    },

	//删除记录
	deleteRecord: function(){
		listPanel=this.get${TemplateName}list();
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
					var store = Ext.data.StoreManager.lookup('${TemplateName}.${TemplateName}Store');
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
		listPanel=this.get${TemplateName}list();
    	sm=listPanel.getSelectionModel();
		
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
			Ext.Ajax.request({
			scope:this,
		    url: '../../scm/control/auditBill?billId='+record.data.id+'&entity=${TemplateName}',
		    success: function(response){
		         this.refreshRecord();
		    }
		});
		}else{
    		showError('请选择记录!');
    	}
		
		
	},
	unauditBill: function(button){
		listPanel=this.get${TemplateName}list();
    	sm=listPanel.getSelectionModel();
		
    	if(sm.hasSelection()){//判断是否选择行记录
    		record=sm.getLastSelected();
			Ext.Ajax.request({
			scope:this,
		    url: '../../scm/control/unauditBill?billId='+record.data.id+'&entity=${TemplateName}',
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
    	var win=this.get${TemplateName}edit();
    	//取表单
    	form=win.down('form');
    	values=form.getValues();

    	var head;
    	if(win.uiStatus=='Modify'){//修改记录
    		head=form.getRecord();
			head.set(values);
			var entryStore=this.get${TemplateName}editentry().store;
			
			//新建一个复合model
			var oneEntryModel=Ext.create('${TemplateName}ActionModel');
			
			var removed = entryStore.getRemovedRecords();   
			var updated = entryStore.getUpdatedRecords();   
			var newed = entryStore.getNewRecords(); 
			if(head.dirty||removed.length>0||updated.length>0||newed.length>0){
				oneEntryModel=processOneEntryModel(oneEntryModel,head,entryStore);
				oneEntryModel.save();
			}
			
    	}else if(win.uiStatus=='AddNew'){//新增记录
		    
    		head=Ext.create('${TemplateName}EditModel');
    		head.set(values);
			var entryGrid=this.get${TemplateName}editentry();
			
			//新建一个复合model
			var oneEntryModel=Ext.create('${TemplateName}ActionModel');
			
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