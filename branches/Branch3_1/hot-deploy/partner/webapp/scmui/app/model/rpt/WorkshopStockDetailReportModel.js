// 定义数据模型
Ext.define('SCM.model.rpt.WorkshopStockDetailReportModel', {
			extend : 'Ext.data.Model',
			alias : 'WorkshopStockDetailReportModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'WORKSHOP_ID',
						type : 'string'
					}, {
						name : 'WORKSHOP_NAME',
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
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryWorkshopStockDetailReport'
				}
			}
		});