Ext.define('SCM.store.PurchaseReturn.PurchaseReturnEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseReturn.PurchaseReturnEditEntryModel',
			alias : 'PurchaseReturnEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});