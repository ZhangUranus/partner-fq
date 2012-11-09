Ext.define('SCM.store.WorkshopReturnProduct.WorkshopReturnProductDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnProduct.WorkshopReturnProductDetailModel',
			alias : 'WorkshopReturnProductDetailStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialMaterialId',
				direction : 'ASC'
			}]
		});