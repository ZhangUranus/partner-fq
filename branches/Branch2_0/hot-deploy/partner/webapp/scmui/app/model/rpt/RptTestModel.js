// 定义数据模型
Ext.define('SCM.model.rpt.RptTestModel', {
			extend : 'Ext.data.Model',
			alias : 'RptTestModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
			        {
						name : 'number',
						type : 'string'
					},
					{
						name : 'biz_date',
						type : 'date',
						format : 'time',
						convert : function(value, record) {
							return new Date(value);
						}
					}
					,
					{
						name : 'name',
						type : 'string'
					}],
			proxy : {
					type : 'jsonajax',
					api : {
						read : '../../scm/control/testRpt'
						}
					}
		});