// 定义数据模型
Ext.define('SCM.model.rpt.StockDetailChartModel', {
			extend : 'Ext.data.Model',
			alias : 'StockDetailChartModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'MATERIAL_ID',
						type : 'string'
					}, {
						name : 'MATERIAL_NAME',
						type : 'string'
					}, {
						name : 'ENDSUM',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryStockDetailChart'
				}
			}
		});