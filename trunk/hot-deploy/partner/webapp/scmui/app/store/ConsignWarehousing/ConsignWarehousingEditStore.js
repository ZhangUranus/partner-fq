Ext.define('SCM.store.ConsignWarehousing.ConsignWarehousingEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignWarehousing.ConsignWarehousingEditModel',
			alias : 'ConsignWarehousingEditStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});