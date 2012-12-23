// 定义数据模型
Ext.define('SCM.model.rpt.PurchaseMatchingReportModel', {
			extend : 'Ext.data.Model',
			alias : 'PurchaseMatchingReportModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'SUPPLIER_ID',
						type : 'string'
					}, {
						name : 'SUPPLIER_NAME',
						type : 'string'
					}, {
						name : 'TYPE_NAME',
						type : 'string'
					}, {
						name : 'MATERIAL_ID',
						type : 'string'
					}, {
						name : 'MATERIAL_NAME',
						type : 'string'
					}, {
						name : 'DEFAULT_UNIT_ID',
						type : 'string'
					}, {
						name : 'DEFAULT_UNIT_NAME',
						type : 'string'
					}, {
						name : 'PRICE',
						type : 'float'
					}, {
						name : 'IN_VOLUME',
						type : 'float'
					}, {
						name : 'OUT_VOLUME',
						type : 'float'
					}, {
						name : 'BILL_ENTRY_SUM',
						type : 'float'
					}, {
						name : 'BILL_VOLUME',
						type : 'float'
					}, {
						name : 'ENTRY_SUM',
						type : 'float'
					}, {
						name : 'VOLUME',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryPurchaseMatchReport'
				}
			}
		});