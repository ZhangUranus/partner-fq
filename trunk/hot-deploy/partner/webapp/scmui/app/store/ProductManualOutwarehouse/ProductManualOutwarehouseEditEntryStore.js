Ext.define('SCM.store.ProductManualOutwarehouse.ProductManualOutwarehouseEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductManualOutwarehouse.ProductManualOutwarehouseEditEntryModel',
			alias : 'ProductManualOutwarehouseEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'sort',
				direction : 'ASC'
			}]
		});