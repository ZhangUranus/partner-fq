// 定义数据模型
Ext.define('SCM.model.basedata.SemiMaterialModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'SemiMaterialModel',
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
						name : 'model',
						type : 'string'
					}, {
						name : 'defaultPrice',
						type : 'float'
					}, {
						name : 'defaultSupplierId',
						type : 'string'
					}, {
						name : 'defaultSupplierName',
						type : 'string'
					},{
						name : 'safeStock',
						type : 'float'
					}, {
						name : 'defaultUnitId',
						type : 'string'
					}, {
						name : 'defaultUnitName',
						type : 'string',
						persist : false
					}, {
						name : 'materialTypeId',
						type : 'string'
					}, {
						name : 'materialTypeName',
						type : 'string',
						persist : false
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : "../../scm/control/requestJsonData?entity=TMaterialListView&whereStr=TMaterialTypeV.number='MTT100002'"
				},
				remoteFilter : true
			}
		});