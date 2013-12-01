Ext.define('SCM.store.rpt.ProductOutReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductOutReportModel',
			alias : 'ProductOutReportStore',
			pageSize : SCM.unpageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据NUMBER字段排序
				property : 'NUMBER',
				direction : 'ASC'
			}]
		});