Ext.define('SCM.store.ConsignWarehousing.ConsignWarehousingDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignWarehousing.ConsignWarehousingDetailModel',
			alias : 'ConsignWarehousingDetailStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialId',
				direction : 'ASC'
			}]
		});