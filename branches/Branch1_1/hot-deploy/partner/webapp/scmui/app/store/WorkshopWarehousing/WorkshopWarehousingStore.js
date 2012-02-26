Ext.define('SCM.store.WorkshopWarehousing.WorkshopWarehousingStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopWarehousing.WorkshopWarehousingModel',
			alias : 'WorkshopWarehousingStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});