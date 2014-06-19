// 定义数据模型
Ext.define('SCM.model.ProductOutNotificationModify.MaterialByGoodNumberModel', {
	extend : 'Ext.data.Model',
	requires : [ 'SCM.extend.proxy.JsonAjax' ],
	alias : 'MaterialByGoodNumberModel',
	// 字段
	fields : [ {
			name : 'notificationEntryId',
			type : 'string'
		}, {
			name : 'orderNumber',
			type : 'string'
		}, {
			name : 'materialId',
			type : 'string'
		}, {
			name : 'materialName',
			type : 'string'
		}, {
			name : 'volume',
			type : 'float'
		}
	],
	proxy : {
		type : 'jsonajax',
		api : {
			read : '../../scm/control/getMaterialByGoodNumber'
		},
		remoteFilter : true
	}
});