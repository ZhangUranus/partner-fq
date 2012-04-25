Ext.define('SCM.store.WorkshopReturnProduct.WorkshopReturnProductEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnProduct.WorkshopReturnProductEditEntryModel',
			alias : 'WorkshopReturnProductEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});