// 定义数据模型
Ext.define('SCM.model.ProductOutNotificationModify.MaterialByGoodNumberSimpleModel', {
	extend : 'Ext.data.Model',
	requires : [ 'SCM.extend.proxy.JsonAjax' ],
	alias : 'MaterialByGoodNumberSimpleModel',
	// 字段
	fields : [ {
			name : 'notificationEntryId',
			type : 'string'
		}, {
			name : 'materialName',
			type : 'string'
		}
	],
	proxy : {
		type : 'jsonajax',
		api : {
			read : '../../scm/control/getMaterialByGoodNumberSimple'
		},
		remoteFilter : true
	}
});