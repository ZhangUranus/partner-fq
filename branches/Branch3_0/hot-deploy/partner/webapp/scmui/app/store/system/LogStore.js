Ext.define('SCM.store.system.LogStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.system.LogModel',
			alias : 'LogStore',
			pageSize : SCM.pageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true,
			sorters : [{//根据hitTime字段排序
				property : 'hitTime',
				direction : 'DESC'
			}]
		});