Ext.define('SCM.store.ProductOutNotification.ProductOutNotificationStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutNotification.ProductOutNotificationModel',
			alias : 'ProductOutNotificationStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});