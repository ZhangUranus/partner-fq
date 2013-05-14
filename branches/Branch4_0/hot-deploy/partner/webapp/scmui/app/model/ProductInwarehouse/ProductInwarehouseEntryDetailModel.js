// 定义数据模型
Ext.define('SCM.model.ProductInwarehouse.ProductInwarehouseEntryDetailModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductInwarehouseEntryDetailModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'parentId',
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
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductInwarehouseEntryDetailView',
					create : '../../scm/control/addnewJsonData?entity=ProductInwarehouseEntryDetail',
					update : '../../scm/control/updateJsonData?entity=ProductInwarehouseEntryDetail',
					destroy : '../../scm/control/deleteJsonData?entity=ProductInwarehouseEntryDetail'
				}
			}
		});