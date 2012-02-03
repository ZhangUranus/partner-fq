Ext.define('SCM.store.basedata.WorkshopStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.WorkshopModel',
			alias : 'WorkshopStore',
			pageSize : 20, //每页行数
			remoteSort : true, //服务器排序
			autoLoad : false,
			autoSync : true
		});