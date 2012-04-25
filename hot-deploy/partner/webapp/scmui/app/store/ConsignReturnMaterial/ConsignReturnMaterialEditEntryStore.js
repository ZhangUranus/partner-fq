Ext.define('SCM.store.ConsignReturnMaterial.ConsignReturnMaterialEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignReturnMaterial.ConsignReturnMaterialEditEntryModel',
			alias : 'ConsignReturnMaterialEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});