Ext.define('SCM.store.system.UserInfoStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.system.UserInfoModel',
			alias : 'UserInfoStore',
			autoLoad : false,
			autoSync : true
		});