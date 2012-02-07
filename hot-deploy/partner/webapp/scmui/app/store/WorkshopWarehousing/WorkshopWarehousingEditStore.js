Ext.define('SCM.store.WorkshopWarehousing.WorkshopWarehousingEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopWarehousing.WorkshopWarehousingEditModel',
			alias : 'WorkshopWarehousingEditStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});