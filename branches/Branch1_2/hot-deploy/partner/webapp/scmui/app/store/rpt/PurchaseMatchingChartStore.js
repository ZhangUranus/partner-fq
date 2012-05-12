Ext.define('SCM.store.rpt.PurchaseMatchingChartStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.PurchaseMatchingChartModel',
			alias : 'PurchaseMatchingChartStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false
		});