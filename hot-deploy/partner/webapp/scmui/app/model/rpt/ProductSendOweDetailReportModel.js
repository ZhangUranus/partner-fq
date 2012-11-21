// 定义数据模型
Ext.define('SCM.model.rpt.ProductSendOweDetailReportModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductSendOweDetailReportModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'DAY_IN_WEEK',
						type : 'string'
					}, {
						name : 'MATERIAL_NAME',
						type : 'string'
					},{
						name : 'THIS_DAY_OUT_QTY',
						type : 'float'
					},{
						name : 'THIS_DAY_IN_QTY',
						type : 'float'
					},{
						name : 'THIS_DAY_CHG_QTY',
						type : 'float'
					},{
						name : 'THIS_DAY_BAL_QTY',
						type : 'float'
					},{
						name : 'THIS_DAY_PLN_QTY',
						type : 'float'
					},{
						name : 'THIS_DAY_OWE_QTY',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryProductSendOweDetailReport'
				}
			}
		});