Ext.define('SCM.store.system.SystemUserStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.system.SystemUserModel',
			alias : 'SystemUserStore',
			remoteSort : true, // 服务器排序
			autoLoad : true,
			autoSync : false,
			remoteFilter : true
		});