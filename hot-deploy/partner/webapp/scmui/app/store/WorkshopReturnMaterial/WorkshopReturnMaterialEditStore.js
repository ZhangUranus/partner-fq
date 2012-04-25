Ext.define('SCM.store.WorkshopReturnMaterial.WorkshopReturnMaterialEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnMaterial.WorkshopReturnMaterialEditModel',
			alias : 'WorkshopReturnMaterialEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});