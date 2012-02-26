Ext.define('SCM.store.ConsignReturnMaterial.ConsignReturnMaterialEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignReturnMaterial.ConsignReturnMaterialEditModel',
			alias : 'ConsignReturnMaterialEditStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});