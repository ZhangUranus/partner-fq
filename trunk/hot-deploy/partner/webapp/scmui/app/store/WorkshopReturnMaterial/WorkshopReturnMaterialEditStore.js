Ext.define('SCM.store.WorkshopReturnMaterial.WorkshopReturnMaterialEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnMaterial.WorkshopReturnMaterialEditModel',
			alias : 'WorkshopReturnMaterialEditStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});