Ext.define('SCM.store.ConsignWarehousing.ConsignWarehousingEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignWarehousing.ConsignWarehousingEditEntryModel',
			alias : 'ConsignWarehousingEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'sort',
				direction : 'ASC'
			}]
		});