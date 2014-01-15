Ext.define('SCM.store.homepage.HomePageVolumeDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.homepage.HomePageVolumeDetailModel',
			alias : 'HomePageVolumeDetailStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false
		});