Ext.define('SCM.store.ConsignWarehousing.ConsignWarehousingEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignWarehousing.ConsignWarehousingEditEntryModel',
			alias : 'ConsignWarehousingEditEntryStore',
			pageSize : 100, // 每页行数
			autoLoad : false,
			autoSync : false
		});