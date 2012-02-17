// 定义数据模型
Ext.define('SCM.model.ProductionPlan.ProductionPlanModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductionPlanModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'WAREHOUSENAME',
						type : 'string'
					}, {
						name : 'MATERIALNAME',
						type : 'string'
					}, {
						name : 'MATERIALMODEL',
						type : 'string'
					}, {
						name : 'UNITNAME',
						type : 'string'
					}, {
						name : 'VOLUME',
						type : 'float'
					}, {
						name : 'STOCKVOLUME',
						type : 'float'
					}, {
						name : 'PRICE',
						type : 'float'
					}, {
						name : 'ENDSUM',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryProductionPlan'
				}
			}
		});