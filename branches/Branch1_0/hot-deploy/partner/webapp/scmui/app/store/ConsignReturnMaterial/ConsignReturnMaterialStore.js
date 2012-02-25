Ext.define('SCM.store.ConsignReturnMaterial.ConsignReturnMaterialStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignReturnMaterial.ConsignReturnMaterialModel',
			alias : 'ConsignReturnMaterialStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});