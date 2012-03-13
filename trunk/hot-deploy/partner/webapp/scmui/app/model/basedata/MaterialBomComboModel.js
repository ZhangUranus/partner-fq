// 定义数据模型
Ext.define('SCM.model.basedata.MaterialBomComboModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'MaterialBomComboModel',
			fields : [// 字段
			{
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'materialId',
						type : 'string'
					}, {
						name : 'materialName',
						type : 'string',
						persist : false
					}, {
						name : 'note',
						type : 'string'
					}, {
						name : 'status',
						type : 'int',
						defaultValue : 0
					}, {
						name : 'valid',
						type : 'string'
					}
			],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=MaterialBomView'
				},
				extraParams : {
					queryField : 'number,materialName'
				}
			}
		});