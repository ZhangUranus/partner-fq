// 定义数据模型
Ext.define('SCM.model.rpt.MonthModel', {
			extend : 'Ext.data.Model',
			alias : 'MonthModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'id',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/getMonthList'
				}
			}
		});