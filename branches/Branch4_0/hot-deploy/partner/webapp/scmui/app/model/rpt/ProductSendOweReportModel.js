// 定义数据模型
Ext.define('SCM.model.rpt.ProductSendOweReportModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductSendOweReportModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'WEEK',
						type : 'string'
					}, {
						name : 'MATERIAL_ID',
						type : 'string'
					}, {
						name : 'MATERIAL_NAME',
						type : 'string'
					}, {
						name : 'LAST_WEEK_BAL_QTY',
						type : 'float'
					}, {
						name : 'LAST_WEEK_OWE_QTY',
						type : 'float'
					}, {
						name : 'THIS_WEEK_OUT_QTY',
						type : 'float'
					}, {
						name : 'THIS_WEEK_IN_QTY',
						type : 'float'
					}, {
						name : 'THIS_WEEK_CHG_QTY',
						type : 'float'
					}, {
						name : 'THIS_WEEK_BAL_QTY',
						type : 'float'
					}, {
						name : 'THIS_WEEK_PLN_QTY',
						type : 'float'
					}, {
						name : 'THIS_WEEK_OWE_QTY',
						type : 'float'
					}, {
						name : 'STOCKING',
						type : 'float'
					}, {
						name : 'STOCKINGBAL',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryProductSendOweReport'
				}
			}
		});