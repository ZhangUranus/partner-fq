// 定义计量单位数据模型
Ext.define('SCM.model.ProductMap.ProductMapModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductMapModel',
			fields : [// 字段
			{
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'ikeaId',
						type : 'string'
					}, {
						name : 'materialId',
						type : 'string'
					}, {
						name : 'materialName',
						type : 'string'
					}, {
						name : 'materialNumber',
						type : 'string'
					}, {
						name : 'entryMaterialId',
						type : 'string'
					}, {
						name : 'entryMaterialName',
						type : 'string'
					}, {
						name : 'entryMaterialNumber',
						type : 'string'
					}, {
						name : 'boardCount',
						type : 'int'
					}, {
						name : 'packageType',
						type : 'string'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductMapView',
					create : '../../scm/control/addnewJsonData?entity=ProductMap',
					update : '../../scm/control/updateJsonData?entity=ProductMap',
					destroy : '../../scm/control/deleteJsonData?entity=ProductMap'
				},
				extraParams : {
					queryField : 'number,materialName,materialNumber,entryMaterialName'
				}
			}
		});