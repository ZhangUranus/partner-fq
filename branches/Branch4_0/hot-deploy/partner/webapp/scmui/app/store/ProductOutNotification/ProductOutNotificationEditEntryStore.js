Ext.define('SCM.store.ProductOutNotification.ProductOutNotificationEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutNotification.ProductOutNotificationEditEntryModel',
			alias : 'ProductOutNotificationEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'sort',
				direction : 'ASC'
			}]
		});