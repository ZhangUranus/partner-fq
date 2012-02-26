// 定义数据模型
Ext.define('SCM.model.rpt.PackingMaterialDetailModel', {
			extend : 'Ext.data.Model',
			alias : 'PackingMaterialDetailModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'MATERIALNUMBER',
						type : 'string'
					}, {
						name : 'MATERIALNAME',
						type : 'string'
					}, {
						name : 'PERVOLUME',
						type : 'float'
					}, {
						name : 'PRICE',
						type : 'float'
					}, {
						name : 'VOLUME',
						type : 'float'
					}, {
						name : 'ENTRYSUM',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryPackingMaterialDetail'
				}
			}
		});