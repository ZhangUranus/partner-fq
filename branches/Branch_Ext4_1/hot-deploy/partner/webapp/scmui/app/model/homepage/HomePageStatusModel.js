// 定义数据模型
Ext.define('SCM.model.homepage.HomePageStatusModel', {
			extend : 'Ext.data.Model',
			alias : 'HomePageStatusModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [{
						name : 'MONTH',
						type : 'string'
					}, {
						name : 'NAME',
						type : 'string'
					}, {
						name : 'DETAIL',
						type : 'string'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryBillStatusList'
				}
			}
		});