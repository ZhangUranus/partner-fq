Ext.define('SCM.store.WorkshopStockAdjust.WorkshopStockAdjustStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopStockAdjust.WorkshopStockAdjustModel',
			alias : 'WorkshopStockAdjustStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});