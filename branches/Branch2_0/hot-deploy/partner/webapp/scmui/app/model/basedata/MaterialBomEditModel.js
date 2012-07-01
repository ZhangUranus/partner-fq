// 定义数据模型
Ext.define('SCM.model.basedata.MaterialBomEditModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'MaterialBomEditModel',

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
						name : 'materialNumber',
						type : 'string',
						persist : false
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

			hasMany : {
				model : 'MaterialBomEditEntryModel',
				name : 'entryList',
				foreignKey : 'parentId',
				associationKey : 'entryList'
			},
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=MaterialBomView'
				},
				extraParams : {
					queryField : 'number,materialNumber,materialName'
				}
			}
		});