Ext.define('SCM.store.basedata.WarehouseStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.WarehouseModel',
			alias : 'WarehouseStore',
			pageSize : 20, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true
		});