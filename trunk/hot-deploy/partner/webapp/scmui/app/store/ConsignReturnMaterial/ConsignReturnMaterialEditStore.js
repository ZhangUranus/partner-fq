Ext.define('SCM.store.ConsignReturnMaterial.ConsignReturnMaterialEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignReturnMaterial.ConsignReturnMaterialEditModel',
			alias : 'ConsignReturnMaterialEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : 16, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});