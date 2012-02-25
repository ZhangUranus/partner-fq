Ext.define('SCM.store.PurchaseReturn.PurchaseReturnStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseReturn.PurchaseReturnModel',
			alias : 'PurchaseReturnStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});