Ext.define('SCM.store.homepage.HomePageVolumeChartStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.homepage.HomePageVolumeChartModel',
			alias : 'HomePageVolumeChartStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false
		});