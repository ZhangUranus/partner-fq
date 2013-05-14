Ext.define('SCM.store.ProductInwarehouse.ProductInwarehouseStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductInwarehouse.ProductInwarehouseModel',
			alias : 'ProductInwarehouseStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});