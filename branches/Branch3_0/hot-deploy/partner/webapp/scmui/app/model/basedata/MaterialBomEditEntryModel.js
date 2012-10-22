// 定义数据模型
Ext.define('SCM.model.basedata.MaterialBomEditEntryModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'MaterialBomEditEntryModel',
			fields : [// 字段
			{
						name : 'id',
						type : 'string'
					}, {
						name : 'parentId',
						type : 'string'
					}, {
						name : 'entryMaterialId',
						type : 'string'
					}, {
						name : 'entryMaterialName',
						type : 'string',
						persist : false
					}, {
						name : 'entryMaterialModel',
						type : 'string',
						persist : false
					}, {
						name : 'volume',
						type : 'float'
					}, {
						name : 'entryUnitId',
						type : 'string'
					}, {
						name : 'entryUnitName',
						type : 'string',
						persist : false
					},{
						name : 'isBomMaterial',
						type : 'string'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=MaterialBomEntryView'
				},
				remoteFilter : true
			}
		});