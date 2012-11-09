Ext.define('SCM.store.rpt.WorkshopStockDetailReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.WorkshopStockDetailReportModel',
			alias : 'WorkshopStockDetailReportStore',
			pageSize : SCM.pageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据WAREHOUSE_NAME字段排序
				property : 'WORKSHOP_NAME',
				direction : 'ASC'
			}]
		});