Ext.define('SCM.store.ProductManualOutwarehouse.ProductManualOutwarehouseEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductManualOutwarehouse.ProductManualOutwarehouseEditModel',
			alias : 'ProductManualOutwarehouseEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});