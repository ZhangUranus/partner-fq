Ext.define('SCM.store.PurchaseBill.PurchaseBillStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.PurchaseBill.PurchaseBillModel',
			alias : 'PurchaseBillStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});