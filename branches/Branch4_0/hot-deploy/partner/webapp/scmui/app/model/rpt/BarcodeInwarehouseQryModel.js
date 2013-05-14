// 定义数据模型
Ext.define('SCM.model.rpt.BarcodeInwarehouseQryModel', {
			extend : 'Ext.data.Model',
			alias : 'BarcodeInwarehouseQryModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'IKEA_NUMBER',
						type : 'string'
					}, {
						name : 'MATERIAL_NAME',
						type : 'string'
					}, {
						name : 'PRODUCT_WEEK',
						type : 'string'
					}, {
						name : 'PRODUCT_IN_DATE',
						type : 'string'
					}, {
						name : 'PER_BOARD_QTY',
						type : 'float'
					}, {
						name : 'BARCODE1',
						type : 'string'
					}, {
						name : 'BARCODE2',
						type : 'string'
					}, {
						name : 'WAREHOUSE',
						type : 'string'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryBarcodeInwarehouseReport'
				}
			}
		});