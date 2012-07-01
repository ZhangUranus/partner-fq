Ext.define('SCM.store.WorkshopReturnProduct.WorkshopReturnProductDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnProduct.WorkshopReturnProductDetailModel',
			alias : 'WorkshopReturnProductDetailStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialMaterialId',
				direction : 'ASC'
			}]
		});