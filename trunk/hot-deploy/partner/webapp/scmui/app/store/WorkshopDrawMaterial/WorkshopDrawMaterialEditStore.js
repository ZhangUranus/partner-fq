Ext.define('SCM.store.WorkshopDrawMaterial.WorkshopDrawMaterialEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopDrawMaterial.WorkshopDrawMaterialEditModel',
			alias : 'WorkshopDrawMaterialEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : 16, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});