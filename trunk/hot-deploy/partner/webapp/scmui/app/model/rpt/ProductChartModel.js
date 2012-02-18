// 定义数据模型
Ext.define('SCM.model.rpt.ProductChartModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductChartModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'MONTH',
						type : 'string'
					}, {
						name : 'INSUM',
						type : 'float'
					}, {
						name : 'OUTSUM',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryProductChart'
				}
			}
		});