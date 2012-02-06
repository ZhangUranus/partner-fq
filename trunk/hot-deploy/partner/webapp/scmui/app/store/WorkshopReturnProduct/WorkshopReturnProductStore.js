Ext.define('SCM.store.WorkshopReturnProduct.WorkshopReturnProductStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnProduct.WorkshopReturnProductModel',
			alias : 'WorkshopReturnProductStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});