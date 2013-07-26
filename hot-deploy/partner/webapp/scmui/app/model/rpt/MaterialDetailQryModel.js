// 定义数据模型
Ext.define('SCM.model.rpt.MaterialDetailQryModel', {
			extend : 'Ext.data.Model',
			alias : 'MaterialDetailQryModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
		            {
						name : 'ID',
						type : 'string'
					}, {
						name : 'NUMBER',
						type : 'string'
					}, {
						name : 'NAME',
						type : 'string'
					}, {
						name : 'VOLUME',
						type : 'float'
					}, {
						name : 'PRICE',
						type : 'float'
					}, {
						name : 'SUM',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryMaterialDetail'
				}
			}
		});