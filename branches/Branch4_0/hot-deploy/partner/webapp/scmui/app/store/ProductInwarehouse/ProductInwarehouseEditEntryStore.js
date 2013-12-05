Ext.define('SCM.store.ProductInwarehouse.ProductInwarehouseEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductInwarehouse.ProductInwarehouseEditEntryModel',
			alias : 'ProductInwarehouseEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'warehouseWarehouseId',
				direction : 'ASC'
			}]
		});