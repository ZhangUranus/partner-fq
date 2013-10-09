Ext.define('SCM.store.rpt.ProductSendOweReportDayStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductSendOweReportDayModel',
			alias : 'ProductSendOweReportDayStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{
				property : 'MATERIAL_NAME',
				direction : 'ASC'
			}]
		});