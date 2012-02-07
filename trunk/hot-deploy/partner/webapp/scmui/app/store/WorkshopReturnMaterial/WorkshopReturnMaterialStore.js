Ext.define('SCM.store.WorkshopReturnMaterial.WorkshopReturnMaterialStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnMaterial.WorkshopReturnMaterialModel',
			alias : 'WorkshopReturnMaterialStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});