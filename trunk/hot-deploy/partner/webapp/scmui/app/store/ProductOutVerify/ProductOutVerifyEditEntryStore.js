Ext.define('SCM.store.ProductOutVerify.ProductOutVerifyEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutVerify.ProductOutVerifyEditEntryModel',
			alias : 'ProductOutVerifyEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'sort',
				direction : 'ASC'
			}]
		});