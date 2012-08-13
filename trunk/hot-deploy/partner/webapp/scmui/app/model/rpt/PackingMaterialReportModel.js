// 定义数据模型
Ext.define('SCM.model.rpt.PackingMaterialReportModel', {
			extend : 'Ext.data.Model',
			alias : 'PackingMaterialReportModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'BIZ_DATE',
						type : 'date',
						defaultValue : new Date(),
						convert : function(value, record) {
							return new Date(value);
						}
					}, {
						name : 'NUMBER',
						type : 'string'
					}, {
						name : 'STATUS',
						type : 'string'
					}, {
						name : 'WAREHOUSENAME',
						type : 'string'
					}, {
						name : 'BOM_ID',
						type : 'string'
					}, {
						name : 'MATERIALNAME',
						type : 'string'
					}, {
						name : 'MATERIALMODEL',
						type : 'string'
					}, {
						name : 'UNITNAME',
						type : 'string'
					}, {
						name : 'VOLUME',
						type : 'float'
					}, {
						name : 'PRICE',
						type : 'float'
					}, {
						name : 'ENTRYSUM',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryPackingMaterialReport'
				}
			}
		});