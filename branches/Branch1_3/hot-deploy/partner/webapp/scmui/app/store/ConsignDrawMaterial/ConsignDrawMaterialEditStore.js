Ext.define('SCM.store.ConsignDrawMaterial.ConsignDrawMaterialEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignDrawMaterial.ConsignDrawMaterialEditModel',
			alias : 'ConsignDrawMaterialEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});