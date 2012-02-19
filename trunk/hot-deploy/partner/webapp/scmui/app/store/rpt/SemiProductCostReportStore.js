Ext.define('SCM.store.rpt.SemiProductCostReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.SemiProductCostReportModel',
			alias : 'SemiProductCostReportStore',
			pageSize : 10, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据BIZ_DATE字段排序
				property : 'BIZ_DATE',
				direction : 'ASC'
			}]
		});