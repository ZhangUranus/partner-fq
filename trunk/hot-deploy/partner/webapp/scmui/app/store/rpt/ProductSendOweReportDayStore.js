Ext.define('SCM.store.rpt.ProductSendOweReportDayStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductSendOweReportDayModel',
			alias : 'ProductSendOweReportDayStore',
			pageSize : SCM.unpageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{
				property : 'MATERIAL_NAME',
				direction : 'ASC'
			}]
		});