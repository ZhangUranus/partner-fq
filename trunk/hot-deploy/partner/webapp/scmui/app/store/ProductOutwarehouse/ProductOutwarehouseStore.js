Ext.define('SCM.store.ProductOutwarehouse.ProductOutwarehouseStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutwarehouse.ProductOutwarehouseModel',
			alias : 'ProductOutwarehouseStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});