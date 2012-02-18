Ext.define('SCM.store.rpt.ProductReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductReportModel',
			alias : 'ProductReportStore',
			pageSize : 10, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据WAREHOUSE_NAME字段排序
				property : 'WAREHOUSE_NAME',
				direction : 'ASC'
			}]
		});