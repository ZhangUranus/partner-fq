// 定义数据模型
Ext.define('SCM.model.rpt.PurchaseMatchingChartModel', {
			extend : 'Ext.data.Model',
			alias : 'PurchaseMatchingChartModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'SUPPLIER_ID',
						type : 'string'
					}, {
						name : 'SUPPLIER_NAME',
						type : 'string'
					}, {
						name : 'ENTRY_SUM',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryPurchaseMatchChart'
				}
			}
		});