Ext.define('SCM.store.WorkshopReturnMaterial.WorkshopReturnMaterialEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnMaterial.WorkshopReturnMaterialEditEntryModel',
			alias : 'WorkshopReturnMaterialEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});