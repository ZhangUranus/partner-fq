// 定义数据模型
Ext.define('SCM.model.basedata.ProductComboModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductComboModel',
			fields : [// 字段
					{
						name : 'productId',
						type : 'string'
					}, {
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}, {
						name : 'model',
						type : 'string'
					}, {
						name : 'defaultPrice',
						type : 'float'
					}, {
						name : 'defaultSupplierId',
						type : 'string'
					},{
						name : 'safeStock',
						type : 'float'
					}, {
						name : 'defaultUnitId',
						type : 'string'
					}, {
						name : 'materialTypeId',
						type : 'string'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductWithProductIdView'
				},
				remoteFilter : true,
				extraParams : {
					queryField : 'number,name'
				}
			}
		});