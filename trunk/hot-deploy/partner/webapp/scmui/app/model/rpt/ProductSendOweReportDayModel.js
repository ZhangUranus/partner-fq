// 定义数据模型
Ext.define('SCM.model.rpt.ProductSendOweReportDayModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductSendOweReportDayModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
			        {
			        	name : 'BIZDATE',
			        	type : 'date',
			        	defaultValue : new Date(),
			        	convert : function(value, record) {
			        		return new Date(value);
			        	}
			        }, {
						name : 'MATERIAL_ID',
						type : 'string'
					}, {
						name : 'MATERIAL_NAME',
						type : 'string'
					}, {
						name : 'ORDER_QTY',
						type : 'float'
					}, {
						name : 'TODAY_BAL',
						type : 'float'
					}, {
						name : 'VOLUME',
						type : 'float'
					}, {
						name : 'TODAY_TOTAL',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryProductSendOweReportDay'
				}
			}
		});