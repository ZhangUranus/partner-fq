Ext.define('SCM.store.ProductOutNotification.ProductOutNotificationEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutNotification.ProductOutNotificationEditModel',
			alias : 'ProductOutNotificationEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});