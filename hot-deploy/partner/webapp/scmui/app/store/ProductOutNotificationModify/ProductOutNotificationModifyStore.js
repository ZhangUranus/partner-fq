Ext.define('SCM.store.ProductOutNotificationModify.ProductOutNotificationModifyStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutNotificationModify.ProductOutNotificationModifyModel',
			alias : 'ProductOutNotificationModifyStore',
			pageSize : SCM.pageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});