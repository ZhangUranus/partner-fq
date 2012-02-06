Ext.define('SCM.store.ConsignWarehousing.ConsignWarehousingStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignWarehousing.ConsignWarehousingModel',
			alias : 'ConsignWarehousingStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number'
		});