Ext.define('SCM.store.PurchaseBill.PurchaseBillEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseBill.PurchaseBillEditEntryModel',
			alias : 'PurchaseBillEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false
		});