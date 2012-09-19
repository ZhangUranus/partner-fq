// 定义数据模型
Ext.define('SCM.model.ProductOutwarehouse.ProductOutDetailModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutDetailModel',
			// 字段
			fields : [{
						name : 'goodNumber',
						type : 'string'
					}, {
						name : 'materialName',
						type : 'string'
					}, {
						name : 'materialModel',
						type : 'string'
					}, {
						name : 'unitName',
						type : 'string'
					}, {
						name : 'qantity',
						type : 'int'
					}, {
						name : 'totalVolume',
						type : 'int'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductOutDetailView'
				},
				remoteFilter : true
			}
		});