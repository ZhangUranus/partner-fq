Ext.define('SCM.store.ConsignDrawMaterial.ConsignDrawMaterialStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignDrawMaterial.ConsignDrawMaterialModel',
			alias : 'ConsignDrawMaterialStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});