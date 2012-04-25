Ext.define('SCM.store.WorkshopDrawMaterial.WorkshopDrawMaterialEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopDrawMaterial.WorkshopDrawMaterialEditEntryModel',
			alias : 'WorkshopDrawMaterialEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});