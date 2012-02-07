Ext.define('SCM.store.WorkshopReturnProduct.WorkshopReturnProductStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnProduct.WorkshopReturnProductModel',
			alias : 'WorkshopReturnProductStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});