// 定义数据模型
Ext.define('SCM.model.rpt.StockDetailReportModel', {
			extend : 'Ext.data.Model',
			alias : 'StockDetailReportModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'WAREHOUSE_ID',
						type : 'string'
					}, {
						name : 'WAREHOUSE_NAME',
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
						name : 'BEGINVOLUME',
						type : 'float'
					}, {
						name : 'BEGINSUM',
						type : 'float'
					}, {
						name : 'BEGINPRICE',
						type : 'float'
					}, {
						name : 'ENDVOLUME',
						type : 'float'
					}, {
						name : 'ENDSUM',
						type : 'float'
					}, {
						name : 'ENDPRICE',
						type : 'float'
					}, {
						name : 'INVOLUME',
						type : 'float'
					}, {
						name : 'INSUM',
						type : 'float'
					}, {
						name : 'INPRICE',
						type : 'float'
					}, {
						name : 'OUTVOLUME',
						type : 'float'
					}, {
						name : 'OUTSUM',
						type : 'float'
					}, {
						name : 'OUTPRICE',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryStockDetailReport'
				}
			}
		});