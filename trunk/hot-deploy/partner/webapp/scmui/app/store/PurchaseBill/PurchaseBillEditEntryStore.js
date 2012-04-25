Ext.define('SCM.store.PurchaseBill.PurchaseBillEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseBill.PurchaseBillEditEntryModel',
			alias : 'PurchaseBillEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});