Ext.define('SCM.store.PurchaseWarehousing.PurchaseWarehousingEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseWarehousing.PurchaseWarehousingEditModel',
			alias : 'PurchaseWarehousingEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : 16, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});