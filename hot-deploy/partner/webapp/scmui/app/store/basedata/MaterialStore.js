Ext.define('SCM.store.basedata.MaterialStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.MaterialModel',
			alias : 'MaterialStore',
			pageSize : 20, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true
		});