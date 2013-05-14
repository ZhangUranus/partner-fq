Ext.define('SCM.store.StockAdjust.StockAdjustEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.StockAdjust.StockAdjustEditModel',
			alias : 'StockAdjustEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});