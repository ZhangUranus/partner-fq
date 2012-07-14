Ext.define('SCM.store.ProductInwarehouse.ProductInwarehouseDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductInwarehouse.ProductInwarehouseDetailModel',
			alias : 'ProductInwarehouseDetailStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialId',
				direction : 'ASC'
			}]
		});