Ext.define('SCM.store.PurchaseReturn.PurchaseReturnEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseReturn.PurchaseReturnEditModel',
			alias : 'PurchaseReturnEditStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});