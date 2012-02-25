// 定义数据模型
Ext.define('SCM.model.basedata.DepartmentTreeModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'DepartmentTreeModel',
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
					read : '../../scm/control/requestTreeJsonData?entity=Department',
					destroy : '../../scm/control/deleteJsonData?entity=Department&isIgnore=true'// 在调用,treestore的load方法时，会调用删除操作，所以忽略实际删除
				},
				reader : {
					root : 'children'
				}
			}
		});