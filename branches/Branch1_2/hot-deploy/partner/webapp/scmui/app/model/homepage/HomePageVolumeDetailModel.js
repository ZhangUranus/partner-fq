// 定义数据模型
Ext.define('SCM.model.homepage.HomePageVolumeDetailModel', {
			extend : 'Ext.data.Model',
			alias : 'HomePageVolumeDetailModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [{
						name : 'ID',
						type : 'string'
					}, {
						name : 'NAME',
						type : 'string'
					}, {
						name : 'WH_VOLUME',
						type : 'float'
					}, {
						name : 'WH_SUM',
						type : 'float'
					}, {
						name : 'WS_VOLUME',
						type : 'float'
					}, {
						name : 'WS_SUM',
						type : 'float'
					}, {
						name : 'CS_VOLUME',
						type : 'float'
					}, {
						name : 'CS_SUM',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryMaterialVolumeDetail'
				}
			}
		});