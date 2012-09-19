// 定义数据模型
Ext.define('SCM.model.ProductOutNotification.ProductOutNotificationDetailModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutNotificationDetailModel',
			// 字段
			fields : [{
						name : 'number',
						type : 'string'
					}, {
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
						name : 'orderQty',
						type : 'int'
					}, {
						name : 'sentQty',
						type : 'int'
					}, {
						name : 'isFinished',
						type : 'string'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductOutNotificationDetailView'
				},
				remoteFilter : true
			}
		});