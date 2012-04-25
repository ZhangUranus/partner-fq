Ext.define('SCM.store.ConsignDrawMaterial.ConsignDrawMaterialEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignDrawMaterial.ConsignDrawMaterialEditEntryModel',
			alias : 'ConsignDrawMaterialEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});