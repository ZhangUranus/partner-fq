// 定义数据模型
Ext.define('SCM.model.rpt.ProductOutReportDetailModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductOutReportDetailModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'PLAN_DELIVERY_DATE',
						type : 'string'
					}, {
						name : 'GOOD_NUMBER',
						type : 'string'
					}, {
						name : 'VOLUME',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryProductOutReportDetail'
				}
			}
		});