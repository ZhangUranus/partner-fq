Ext.define('SCM.store.WorkshopWarehousing.WorkshopWarehousingEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopWarehousing.WorkshopWarehousingEditEntryModel',
			alias : 'WorkshopWarehousingEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'sort',
				direction : 'ASC'
			}]
		});