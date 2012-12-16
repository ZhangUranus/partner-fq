Ext.define('SCM.store.ProductReturn.ProductReturnEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductReturn.ProductReturnEditEntryModel',
			alias : 'ProductReturnEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'warehouseWarehouseId',
				direction : 'ASC'
			}]
		});