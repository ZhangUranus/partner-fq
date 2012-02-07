Ext.define('SCM.store.ConsignReturnProduct.ConsignReturnProductStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignReturnProduct.ConsignReturnProductModel',
			alias : 'ConsignReturnProductStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});