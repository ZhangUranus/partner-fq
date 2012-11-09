Ext.define('SCM.store.ProductInwarehouse.ProductInwarehouseEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductInwarehouse.ProductInwarehouseEditModel',
			alias : 'ProductInwarehouseEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});