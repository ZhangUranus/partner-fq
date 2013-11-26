// 定义数据模型
Ext.define('SCM.model.rpt.CurrentStockQryModel', {
			extend : 'Ext.data.Model',
			alias : 'CurrentStockQryModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
		            {
						name : 'NUMBER',
						type : 'string'
					}, {
						name : 'MATERIAL_NAME',
						type : 'string'
					}, {
						name : 'UNIT_NAME',
						type : 'string'
					}, {
						name : 'HOUSE_NAME',
						type : 'string'
					}, {
						name : 'VOLUME',
						type : 'float'
					}, {
						name : 'WORKSHOP_VOLUME',
						type : 'float'
					}, {
						name : 'SUPPLIER_VOLUME',
						type : 'float'
					}, {
						name : 'PLAN_VOLUME',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryCurrentStock'
				}
			}
		});