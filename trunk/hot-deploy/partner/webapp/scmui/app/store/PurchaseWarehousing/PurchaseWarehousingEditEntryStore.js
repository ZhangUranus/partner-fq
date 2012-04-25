Ext.define('SCM.store.PurchaseWarehousing.PurchaseWarehousingEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseWarehousing.PurchaseWarehousingEditEntryModel',
			alias : 'PurchaseWarehousingEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});