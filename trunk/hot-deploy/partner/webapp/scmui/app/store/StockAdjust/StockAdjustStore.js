Ext.define('SCM.store.StockAdjust.StockAdjustStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.StockAdjust.StockAdjustModel',
			alias : 'StockAdjustStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});