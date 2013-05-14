Ext.define('SCM.store.quality.CheckProject.CheckProjectStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.quality.CheckProject.CheckProjectModel',
			alias : 'CheckProjectStore',
			pageSize : SCM.pageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});