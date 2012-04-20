Ext.define('SCM.store.WorkshopReturnProduct.WorkshopReturnProductEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnProduct.WorkshopReturnProductEditModel',
			alias : 'WorkshopReturnProductEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : 16, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});