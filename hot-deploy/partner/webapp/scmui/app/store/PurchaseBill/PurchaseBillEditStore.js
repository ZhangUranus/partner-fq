Ext.define('SCM.store.PurchaseBill.PurchaseBillEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseBill.PurchaseBillEditModel',
			alias : 'PurchaseBillEditStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});