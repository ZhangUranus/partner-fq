Ext.define('SCM.store.ConsignDrawMaterial.ConsignDrawMaterialStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignDrawMaterial.ConsignDrawMaterialModel',
			alias : 'ConsignDrawMaterialStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});