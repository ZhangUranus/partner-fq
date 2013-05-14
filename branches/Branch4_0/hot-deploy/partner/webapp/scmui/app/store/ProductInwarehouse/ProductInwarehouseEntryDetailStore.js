Ext.define('SCM.store.ProductInwarehouse.ProductInwarehouseEntryDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductInwarehouse.ProductInwarehouseEntryDetailModel',
			alias : 'ProductInwarehouseEntryDetailStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialId',
				direction : 'ASC'
			}]
			
		});