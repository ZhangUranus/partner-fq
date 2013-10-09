// 定义数据模型
Ext.define('SCM.model.rpt.ProductSendOweDetailReportDayModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductSendOweDetailReportDayModel',
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
						name : 'NUMBER',
						type : 'string'
					}, {
						name : 'GOOD_NUMBER',
						type : 'string'
					}, {
						name : 'PLAN_CONTAINER_TYPE',
						type : 'string'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryProductSendOweDetailReportDay'
				}
			}
		});