Ext.define('SCM.store.StockAdjust.StockAdjustEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.StockAdjust.StockAdjustEditEntryModel',
			alias : 'StockAdjustEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false
		});