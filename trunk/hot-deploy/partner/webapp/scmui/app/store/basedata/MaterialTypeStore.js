Ext.define('SCM.store.basedata.MaterialTypeStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.MaterialTypeModel',
			alias : 'MaterialTypeStore',
			pageSize : 20, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true
		});