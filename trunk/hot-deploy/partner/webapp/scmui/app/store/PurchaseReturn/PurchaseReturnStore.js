Ext.define('SCM.store.PurchaseReturn.PurchaseReturnStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseReturn.PurchaseReturnModel',
			alias : 'PurchaseReturnStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});