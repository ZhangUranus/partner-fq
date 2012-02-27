// 定义仓库类型数据模型
Ext.define('SCM.model.basedata.WorkshopModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'WorkshopModel',
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
						name : 'description',
						type : 'string'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=Workshop',
					create : '../../scm/control/addnewJsonData?entity=Workshop',
					update : '../../scm/control/updateJsonData?entity=Workshop',
					destroy : '../../scm/control/deleteJsonData?entity=Workshop'
				},
				extraParams : {
					queryField : 'number,name'
				}
			}
		});