Ext.define('SCM.store.WorkshopWarehousing.WorkshopWarehousingCheckStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopWarehousing.WorkshopWarehousingCheckModel',
			alias : 'WorkshopWarehousingCheckStore',
			autoLoad : false,
			autoSync : false,
			pageSize:SCM.unpageSize,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialId',
				direction : 'ASC'
			}]
		});