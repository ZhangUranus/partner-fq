Ext.define('SCM.store.rpt.ProductSendOweEntryReportDayStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductSendOweEntryReportDayModel',
			alias : 'ProductSendOweEntryReportDayStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{
				property : 'MATERIAL_NAME',
				direction : 'ASC'
			}]
		});