Ext.define('SCM.store.rpt.ProductOutReportDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ProductOutReportDetailModel',
			alias : 'ProductOutReportDetailStore',
			pageSize : SCM.unpageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据PLAN_DELIVERY_DATE字段排序
				property : 'PLAN_DELIVERY_DATE',
				direction : 'ASC'
			}]
		});