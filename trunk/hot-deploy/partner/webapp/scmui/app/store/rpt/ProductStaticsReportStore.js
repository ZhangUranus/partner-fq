Ext.define('SCM.store.rpt.ProductStaticsReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductStaticsReportModel',
			alias : 'ProductStaticsReportStore',
			pageSize : SCM.pageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据WAREHOUSE_NAME字段排序
				property : 'MATERIAL_NAME',
				direction : 'ASC'
			}]
		});