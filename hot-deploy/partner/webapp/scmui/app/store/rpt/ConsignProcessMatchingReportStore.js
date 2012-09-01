Ext.define('SCM.store.rpt.ConsignProcessMatchingReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ConsignProcessMatchingReportModel',
			alias : 'ConsignProcessMatchingReportStore',
			pageSize : SCM.pageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{
				property : 'supplier_name',
				direction : 'ASC'
			}]
		});