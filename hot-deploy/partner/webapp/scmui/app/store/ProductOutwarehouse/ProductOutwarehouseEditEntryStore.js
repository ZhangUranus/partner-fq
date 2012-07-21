Ext.define('SCM.store.ProductOutwarehouse.ProductOutwarehouseEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutwarehouse.ProductOutwarehouseEditEntryModel',
			alias : 'ProductOutwarehouseEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false
		});