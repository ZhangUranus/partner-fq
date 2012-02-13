Ext.define('SCM.store.WorkshopWarehousing.WorkshopWarehousingDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopWarehousing.WorkshopWarehousingDetailModel',
			alias : 'WorkshopWarehousingDetailStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialId',
				direction : 'ASC'
			}]
		});