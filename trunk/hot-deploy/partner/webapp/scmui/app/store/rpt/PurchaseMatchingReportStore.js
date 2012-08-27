Ext.define('SCM.store.rpt.PurchaseMatchingReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.PurchaseMatchingReportModel',
			alias : 'PurchaseMatchingReportStore',
			pageSize : SCM.pageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false
		});