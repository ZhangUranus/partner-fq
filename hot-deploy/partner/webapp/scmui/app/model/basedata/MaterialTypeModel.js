//定义计量单位数据模型
Ext.define('SCM.model.basedata.MaterialTypeModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'MaterialTypeModel',
			fields : [//字段
			{
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}],
			idgen : 'uuid', //使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=TMaterialType',
					create : '../../scm/control/addnewJsonData?entity=TMaterialType',
					update : '../../scm/control/updateJsonData?entity=TMaterialType',
					destroy : '../../scm/control/deleteJsonData?entity=TMaterialType'
				}
			}
		});