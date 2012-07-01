Ext.define('SCM.store.rpt.StockDetailReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.StockDetailReportModel',
			alias : 'StockDetailReportStore',
			pageSize : SCM.pageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据WAREHOUSE_NAME字段排序
				property : 'WAREHOUSE_NAME',
				direction : 'ASC'
			}]
		});