Ext.define('SCM.store.ConsignWarehousing.ConsignWarehousingEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignWarehousing.ConsignWarehousingEditModel',
			alias : 'ConsignWarehousingEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});