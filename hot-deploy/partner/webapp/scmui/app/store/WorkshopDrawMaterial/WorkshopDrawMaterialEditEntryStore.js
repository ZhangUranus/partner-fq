Ext.define('SCM.store.WorkshopDrawMaterial.WorkshopDrawMaterialEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopDrawMaterial.WorkshopDrawMaterialEditEntryModel',
			alias : 'WorkshopDrawMaterialEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'sort',
				direction : 'ASC'
			}]
		});