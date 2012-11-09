Ext.define('SCM.store.ProductManualOutwarehouse.ProductManualOutwarehouseStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductManualOutwarehouse.ProductManualOutwarehouseModel',
			alias : 'ProductManualOutwarehouseStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});