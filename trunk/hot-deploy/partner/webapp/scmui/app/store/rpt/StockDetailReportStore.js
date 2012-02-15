Ext.define('SCM.store.rpt.StockDetailReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.StockDetailReportModel',
			alias : 'StockDetailReportStore',
			pageSize : 10, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据warehouse_name字段排序
				property : 'warehouse_name',
				direction : 'ASC'
			}]
		});