// 定义数据模型
Ext.define('SCM.model.rpt.ProductStaticsReportModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductStaticsReportModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'TRAD_DATE',
						type : 'string'
					}, {
						name : 'ENTRY_MATERIAL_NAME',
						type : 'string'
					}, {
						name : 'MATERIAL_ID',
						type : 'string'
					}, {
						name : 'MATERIAL_NAME',
						type : 'string'
					}, {
						name : 'QANTITY',
						type : 'string'
					}, {
						name : 'PRE_MONTH_VOLUME',
						type : 'float'
					}, {
						name : 'PRE_MONTH_PRODUCT_VOLUME',
						type : 'float'
					}, {
						name : 'TODAY_IN_VOLUME',
						type : 'float'
					}, {
						name : 'TODAY_OUT_VOLUME',
						type : 'float'
					}, {
						name : 'TODAY_VOLUME',
						type : 'float'
					}, {
						name : 'TODAY_PRODUCT_VOLUME',
						type : 'float'
					}, {
						name : 'THIS_MONTH_IN_VOLUME',
						type : 'float'
					}, {
						name : 'THIS_MONTH_IN_PRODUCT_VOLUME',
						type : 'float'
					}, {
						name : 'THIS_MONTH_OUT_VOLUME',
						type : 'float'
					}, {
						name : 'THIS_MONTH_OUT_PRODUCT_VOLUME',
						type : 'float'
					}, {
						name : 'VOLUME',
						type : 'float'
					}, {
						name : 'PRODUCT_VOLUME',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryProductStaticsReport'
				}
			}
		});