Ext.define('SCM.store.ConsignReturnProduct.ConsignReturnProductStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignReturnProduct.ConsignReturnProductModel',
			alias : 'ConsignReturnProductStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});