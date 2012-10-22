// 定义数据模型
Ext.define('SCM.model.rpt.ConsignProcessMatchingChartModel', {
			extend : 'Ext.data.Model',
			alias : 'ConsignProcessMatchingChartModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'SUPPLIER_ID',
						type : 'string'
					}, {
						name : 'SUPPLIER_NAME',
						type : 'string'
					}, {
						name : 'TOTAL_IN_SUM',
						type : 'float'
					}, {
						name : 'TOTAL_OUT_SUM',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryConsignMatchChart'
				}
			}
		});