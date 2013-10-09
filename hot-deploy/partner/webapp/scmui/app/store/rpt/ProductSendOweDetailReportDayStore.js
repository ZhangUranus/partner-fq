Ext.define('SCM.store.rpt.ProductSendOweDetailReportDayStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductSendOweDetailReportDayModel',
			alias : 'ProductSendOweDetailReportDayStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{
				property : 'NUMBER',
				direction : 'DESC'
			}]
		});