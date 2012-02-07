Ext.define('SCM.store.PurchaseWarehousing.PurchaseWarehousingEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseWarehousing.PurchaseWarehousingEditModel',
			alias : 'PurchaseWarehousingEditStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});