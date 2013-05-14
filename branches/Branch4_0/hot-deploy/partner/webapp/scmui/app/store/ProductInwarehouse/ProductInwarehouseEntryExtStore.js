Ext.define('SCM.store.ProductInwarehouse.ProductInwarehouseEntryExtStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductInwarehouse.ProductInwarehouseEntryExtModel',
			alias : 'ProductInwarehouseEntryExtStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false
		});