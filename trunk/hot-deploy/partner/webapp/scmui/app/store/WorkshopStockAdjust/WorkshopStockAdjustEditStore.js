Ext.define('SCM.store.WorkshopStockAdjust.WorkshopStockAdjustEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopStockAdjust.WorkshopStockAdjustEditModel',
			alias : 'WorkshopStockAdjustEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});