Ext.define('SCM.store.ProductOutNotification.ProductOutNotificationDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutNotification.ProductOutNotificationDetailModel',
			alias : 'ProductOutNotificationDetailStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'goodNumber',
				direction : 'ASC'
			}]
		});