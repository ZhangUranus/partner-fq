Ext.define('SCM.store.rpt.ProductSendOweReportStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductSendOweReportModel',
			alias : 'ProductSendOweReportStore',
//			pageSize : SCM.halfPageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			groupField : 'ENTRY_MATERIAL_NAME',
			sorters : [{
				property : 'ENTRY_MATERIAL_NAME',
				direction : 'ASC'
			}],
			sorters : [{
				property : 'SORT',
				direction : 'DESC'
			}]
		});