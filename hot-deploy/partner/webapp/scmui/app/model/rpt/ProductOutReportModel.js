// 定义数据模型
Ext.define('SCM.model.rpt.ProductOutReportModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductOutReportModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'MATERIAL_ID',
						type : 'string'
					}, {
						name : 'NUMBER',
						type : 'string'
					}, {
						name : 'MATERIAL_NAME',
						type : 'string'
					}, {
						name : 'DEFAULT_UNIT_ID',
						type : 'string'
					}, {
						name : 'DEFAULT_UNIT_NAME',
						type : 'string'
					}, {
						name : 'BEGINVOLUME',
						type : 'float'
					}, {
						name : 'ENDVOLUME',
						type : 'float'
					}, {
						name : 'INVOLUME',
						type : 'float'
					}, {
						name : 'OUTVOLUME',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryProductOutReport'
				}
			}
		});