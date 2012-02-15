Ext.define('SCM.store.rpt.ConsignProcessMatchingReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ConsignProcessMatchingReportModel',
			alias : 'ConsignProcessMatchingReportStore',
			pageSize : 10, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据supplier_name字段排序
				property : 'supplier_name',
				direction : 'ASC'
			}]
		});