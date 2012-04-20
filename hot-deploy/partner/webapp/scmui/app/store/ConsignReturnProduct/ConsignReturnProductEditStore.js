Ext.define('SCM.store.ConsignReturnProduct.ConsignReturnProductEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignReturnProduct.ConsignReturnProductEditModel',
			alias : 'ConsignReturnProductEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : 16, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});