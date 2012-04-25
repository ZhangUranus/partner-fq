Ext.define('SCM.store.WorkshopWarehousing.WorkshopWarehousingEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopWarehousing.WorkshopWarehousingEditEntryModel',
			alias : 'WorkshopWarehousingEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});