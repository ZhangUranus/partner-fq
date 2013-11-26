Ext.define('SCM.store.rpt.CurrentStockQryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.CurrentStockQryModel',
			alias : 'CurrentStockQryStore',
			pageSize : SCM.limitPageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			groupField : 'MATERIAL_NAME',
			sorters : [{
				property : 'MATERIAL_NAME',
				direction : 'ASC'
			}]
		});