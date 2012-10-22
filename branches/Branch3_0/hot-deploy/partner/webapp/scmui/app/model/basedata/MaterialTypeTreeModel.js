// 定义数据模型
Ext.define('SCM.model.basedata.MaterialTypeTreeModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'MaterialTypeTreeModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'text',
						type : 'string'
					}, {
						name : 'leaf',
						type : 'boolean',
						defaultValue : true
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestTreeJsonData?entity=TMaterialType'
				},
				reader : {
					root : 'children'
				}
			}
		});