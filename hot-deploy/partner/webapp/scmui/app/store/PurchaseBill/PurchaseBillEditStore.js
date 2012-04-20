Ext.define('SCM.store.PurchaseBill.PurchaseBillEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseBill.PurchaseBillEditModel',
			alias : 'PurchaseBillEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : 16, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});