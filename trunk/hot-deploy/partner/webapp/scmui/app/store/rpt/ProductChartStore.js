Ext.define('SCM.store.rpt.ProductChartStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductChartModel',
			alias : 'ProductChartStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false
		});