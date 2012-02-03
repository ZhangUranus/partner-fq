Ext.define('SCM.store.ConsignReturnMaterial.ConsignReturnMaterialStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignReturnMaterial.ConsignReturnMaterialModel',
			alias : 'ConsignReturnMaterialStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});