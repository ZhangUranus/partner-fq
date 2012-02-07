Ext.define('SCM.store.ConsignDrawMaterial.ConsignDrawMaterialEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignDrawMaterial.ConsignDrawMaterialEditModel',
			alias : 'ConsignDrawMaterialEditStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});