// 定义数据模型
Ext.define('SCM.model.homepage.HomePageVolumeChartModel', {
			extend : 'Ext.data.Model',
			alias : 'HomePageVolumeChartModel',
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
					read : '../../scm/control/queryMaterialVolumeChart'
				}
			}
		});