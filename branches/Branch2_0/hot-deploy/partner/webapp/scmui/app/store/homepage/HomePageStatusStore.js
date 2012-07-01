Ext.define('SCM.store.homepage.HomePageStatusStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.homepage.HomePageStatusModel',
			alias : 'HomePageStatusStore',
			remoteSort : true, // 服务器排序
			autoLoad : true,
			autoSync : false
		});