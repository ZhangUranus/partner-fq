Ext.define('SCM.store.basedata.MaterialBomStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.MaterialBomModel',
			alias : 'MaterialBomStore',
			pageSize : 20, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});