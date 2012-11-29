// 定义数据模型
Ext.define('SCM.model.rpt.BarcodeOutwarehouseQryModel', {
			extend : 'Ext.data.Model',
			alias : 'BarcodeOutwarehouseQryModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
		            {
						name : 'DELIVERY_NUMBER',
						type : 'string'
					},
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
						name : 'PRODUCT_OUT_DATE',
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
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryBarcodeOutwarehouseReport'
				}
			}
		});