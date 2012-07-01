Ext.define('SCM.store.WorkshopStockAdjust.WorkshopStockAdjustEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopStockAdjust.WorkshopStockAdjustEditEntryModel',
			alias : 'WorkshopStockAdjustEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false
		});