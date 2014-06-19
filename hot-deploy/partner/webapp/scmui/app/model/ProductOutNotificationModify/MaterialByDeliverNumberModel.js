// 定义数据模型
Ext.define('SCM.model.ProductOutNotificationModify.MaterialByDeliverNumberModel', {
	extend : 'Ext.data.Model',
	requires : [ 'SCM.extend.proxy.JsonAjax' ],
	alias : 'MaterialByDeliverNumberModel',
	// 字段
	fields : [ {
			name : 'verifyEntryId',
			type : 'string'
		}, {
			name : 'materialId',
			type : 'string'
		}, {
			name : 'materialName',
			type : 'string'
		}, {
			name : 'verifyEntryVolume',
			type : 'float'
		}
	],
	proxy : {
		type : 'jsonajax',
		api : {
			read : '../../scm/control/getMaterialByDeliverNumber'
		},
		remoteFilter : true
	}
});