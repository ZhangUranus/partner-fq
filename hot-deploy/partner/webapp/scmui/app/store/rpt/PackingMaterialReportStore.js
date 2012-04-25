Ext.define('SCM.store.rpt.PackingMaterialReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.PackingMaterialReportModel',
			alias : 'PackingMaterialReportStore',
			pageSize : 16, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据BIZ_DATE字段排序
				property : 'BIZ_DATE',
				direction : 'ASC'
			}]
		});