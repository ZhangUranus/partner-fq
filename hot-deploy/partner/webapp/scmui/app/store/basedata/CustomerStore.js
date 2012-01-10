Ext.define('SCM.store.basedata.CustomerStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.CustomerModel',
			alias : 'CustomerStore',
			pageSize : 20, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true
		});