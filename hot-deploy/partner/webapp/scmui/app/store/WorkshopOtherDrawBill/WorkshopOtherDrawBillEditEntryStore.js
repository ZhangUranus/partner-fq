Ext.define('SCM.store.WorkshopOtherDrawBill.WorkshopOtherDrawBillEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopOtherDrawBill.WorkshopOtherDrawBillEditEntryModel',
			alias : 'WorkshopOtherDrawBillEditEntryStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'sort',
				direction : 'ASC'
			}]
		});