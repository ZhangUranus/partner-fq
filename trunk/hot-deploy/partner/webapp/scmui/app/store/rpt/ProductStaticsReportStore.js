Ext.define('SCM.store.rpt.ProductStaticsReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductStaticsReportModel',
			alias : 'ProductStaticsReportStore',
			pageSize : SCM.unpageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			groupField : 'ENTRY_MATERIAL_NAME',
			sorters : [{
				property : 'ENTRY_MATERIAL_NAME',
				direction : 'ASC'
			}]
		});