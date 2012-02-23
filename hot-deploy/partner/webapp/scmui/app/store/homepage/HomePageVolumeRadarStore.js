Ext.define('SCM.store.homepage.HomePageVolumeRadarStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.homepage.HomePageVolumeRadarModel',
			alias : 'HomePageVolumeRadarStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false
		});