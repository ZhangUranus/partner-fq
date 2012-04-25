Ext.define('SCM.store.ConsignReturnProduct.ConsignReturnProductEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignReturnProduct.ConsignReturnProductEditEntryModel',
			alias : 'ConsignReturnProductEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});