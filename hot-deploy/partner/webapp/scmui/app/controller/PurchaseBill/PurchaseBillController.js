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
	requires:['SCM.model.PurchaseBill.PurchaseBillActionModel'],
	editName:'PurchaseBilledit',
	editStoreName:'PurchaseBillEditStore',
	entityName:'PurchaseBill',
	modelName:'PurchaseBillEditModel',
	entryModelName:'PurchaseBillEditEntryModel',
	actionModelName:'PurchaseBillActionModel',
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
			},
			//编辑界面打印
			'PurchaseBilledit button[action=print]':{
				click: this.print
			}
		}
		);
    }

});