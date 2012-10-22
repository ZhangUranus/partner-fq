// 定义数据模型
Ext.define('SCM.model.basedata.CustomerModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'CustomerModel',
			fields : [// 字段
			{
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}, {
						name : 'address',
						type : 'string'
					}, {
						name : 'contractor',
						type : 'string'
					}, {
						name : 'phone',
						type : 'string'
					}, {
						name : 'fax',
						type : 'string'
					}, {
						name : 'email',
						type : 'string'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=Customer',
					create : '../../scm/control/addnewJsonData?entity=Customer',
					update : '../../scm/control/updateJsonData?entity=Customer',
					destroy : '../../scm/control/deleteJsonData?entity=Customer'
				},
				extraParams : {
					queryField : 'number,name'
				}
			}
		});