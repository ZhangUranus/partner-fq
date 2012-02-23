// 定义数据模型
Ext.define('SCM.model.homepage.HomePageVolumeRadarModel', {
			extend : 'Ext.data.Model',
			alias : 'HomePageVolumeRadarModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [{
						name : 'NAME',
						type : 'string'
					}, {
						name : 'VOLUME',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryMaterialVolumeRadar'
				}
			}
		});