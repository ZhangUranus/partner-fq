Ext.define('SCM.store.ProductInwarehouse.ProductInwarehouseStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductInwarehouse.ProductInwarehouseModel',
			alias : 'ProductInwarehouseStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});