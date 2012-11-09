Ext.define('SCM.store.ConsignReturnMaterial.ConsignReturnMaterialEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignReturnMaterial.ConsignReturnMaterialEditEntryModel',
			alias : 'ConsignReturnMaterialEditEntryStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'sort',
				direction : 'ASC'
			}]
		});