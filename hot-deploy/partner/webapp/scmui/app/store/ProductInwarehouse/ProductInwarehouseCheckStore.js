Ext.define('SCM.store.ProductInwarehouse.ProductInwarehouseCheckStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductInwarehouse.ProductInwarehouseCheckModel',
			alias : 'ProductInwarehouseCheckStore',
			autoLoad : false,
			autoSync : false,
			pageSize:SCM.unpageSize,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialId',
				direction : 'ASC'
			}]
		});