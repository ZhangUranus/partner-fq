Ext.define('SCM.store.ProductReturn.ProductReturnStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductReturn.ProductReturnModel',
			alias : 'ProductReturnStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});