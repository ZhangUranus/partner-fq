Ext.define('SCM.store.ProductReturn.ProductReturnEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductReturn.ProductReturnEditModel',
			alias : 'ProductReturnEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});