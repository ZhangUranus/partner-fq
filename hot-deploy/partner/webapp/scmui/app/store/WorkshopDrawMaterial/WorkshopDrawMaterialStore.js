Ext.define('SCM.store.WorkshopDrawMaterial.WorkshopDrawMaterialStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopDrawMaterial.WorkshopDrawMaterialModel',
			alias : 'WorkshopDrawMaterialStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});