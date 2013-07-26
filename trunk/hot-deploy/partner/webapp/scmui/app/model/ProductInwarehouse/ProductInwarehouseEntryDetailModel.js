// 定义数据模型
Ext.define('SCM.model.ProductInwarehouse.ProductInwarehouseEntryDetailModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductInwarehouseEntryDetailModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'inBizDate',
						defaultValue : new Date(),
						type : 'date',
						format : 'time',
						convert : function(value, record) {
							return new Date(value);
						}
					}, {
						name : 'inParentId',
						type : 'string'
					}, {
						name : 'inParentParentId',
						type : 'string'
					}, {
						name : 'outBizDate',
						defaultValue : new Date(),
						type : 'date',
						format : 'time',
						convert : function(value, record) {
							return new Date(value);
						}
					}, {
						name : 'outParentId',
						type : 'string'
					}, {
						name : 'outParentParentId',
						type : 'string'
					}, {
						name : 'barcode1',
						type : 'string'
					}, {
						name : 'barcode2',
						type : 'string'
					}, {
						name : 'materialId',
						type : 'string'
					}, {
						name : 'model',
						type : 'string'
					}, {
						name : 'quantity',
						type : 'string'
					}, {
						name : 'unitUnitId',
						type : 'string'
					}, {
						name : 'price',
						type : 'string'
					}, {
						name : 'amount',
						type : 'string'
					}, {
						name : 'isIn',
						type : 'int',
						defaultValue : 0
					}, {
						name : 'isOut',
						type : 'int',
						defaultValue : 0
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					//请求时动态增加entity参数
					read : '../../scm/control/requestJsonData',
					create : '../../scm/control/addnewJsonData?entity=ProductInwarehouseEntryDetail',
					update : '../../scm/control/updateJsonData?entity=ProductInwarehouseEntryDetail',
					destroy : '../../scm/control/deleteJsonData?entity=ProductInwarehouseEntryDetail'
				}
			}
		});