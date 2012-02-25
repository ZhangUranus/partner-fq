Ext.define('SCM.store.rpt.StockDetailChartStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.StockDetailChartModel',
			alias : 'StockDetailChartStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false
		});