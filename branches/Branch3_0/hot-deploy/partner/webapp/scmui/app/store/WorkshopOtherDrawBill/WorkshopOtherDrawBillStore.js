Ext.define('SCM.store.WorkshopOtherDrawBill.WorkshopOtherDrawBillStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopOtherDrawBill.WorkshopOtherDrawBillModel',
			alias : 'WorkshopOtherDrawBillStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});