Ext.define('SCM.store.PurchaseWarehousing.PurchaseWarehousingStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseWarehousing.PurchaseWarehousingModel',
			alias : 'PurchaseWarehousingStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});