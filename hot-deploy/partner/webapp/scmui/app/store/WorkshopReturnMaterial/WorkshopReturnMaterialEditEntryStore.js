Ext.define('SCM.store.WorkshopReturnMaterial.WorkshopReturnMaterialEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopReturnMaterial.WorkshopReturnMaterialEditEntryModel',
			alias : 'WorkshopReturnMaterialEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'sort',
				direction : 'ASC'
			}]
		});