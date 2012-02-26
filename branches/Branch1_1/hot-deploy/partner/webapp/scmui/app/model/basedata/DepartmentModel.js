// 定义数据模型
Ext.define('SCM.model.basedata.DepartmentModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'DepartmentModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'parentId',
						type : 'string'
					}, {
						name : 'parentDeptName',
						type : 'string',
						persist : false
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=DepartmentListView',
					create : '../../scm/control/addnewJsonData?entity=Department',
					update : '../../scm/control/updateJsonData?entity=Department',
					destroy : '../../scm/control/deleteJsonData?entity=Department'
				}
			}
		});