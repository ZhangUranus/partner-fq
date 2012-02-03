Ext.define('SCM.store.WorkshopReturnMaterial.WorkshopReturnMaterialStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnMaterial.WorkshopReturnMaterialModel',
			alias : 'WorkshopReturnMaterialStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});