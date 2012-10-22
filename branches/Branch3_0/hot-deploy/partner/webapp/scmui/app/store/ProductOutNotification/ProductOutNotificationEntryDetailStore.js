Ext.define('SCM.store.ProductOutNotification.ProductOutNotificationEntryDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutNotification.ProductOutNotificationEntryDetailModel',
			alias : 'ProductOutNotificationEntryDetailStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'sort',
				direction : 'ASC'
			}]
		});