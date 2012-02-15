Ext.define('SCM.store.rpt.ConsignProcessMatchingChartStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.ConsignProcessMatchingChartModel',
			alias : 'ConsignProcessMatchingChartStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据supplier_name字段排序
				property : 'supplier_name',
				direction : 'ASC'
			}]
		});