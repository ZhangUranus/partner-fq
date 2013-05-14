// 定义数据模型
Ext.define('SCM.model.ProductOutNotification.ProductOutNotificationEditEntryModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutNotificationEditEntryModel',
			// 字段
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'parentId',
						type : 'string'
					}, {
						name : 'orderNumber',
						type : 'string'
					}, {
						name : 'orderType',
						type : 'string'
					}, {
						name : 'destinationId',
						type : 'string'
					}, {
						name : 'requireReceiveDate',
						type : 'date',
						defaultValue : new Date(),
						convert : function(value, record) {
							return new Date(value);
						}
					}, {
						name : 'orderGetDate',
						type : 'date',
						defaultValue : new Date(),
						convert : function(value, record) {
							return new Date(value);
						}
					}, {
						name : 'materialId',
						type : 'string'
					}, {
						name : 'materialName',
						type : 'string',
						persist : false
					}, {
						name : 'volume',
						type : 'float'
					}, {
						name : 'grossWeight',
						type : 'float'
					}, {
						name : 'grossSize',
						type : 'float'
					}, {
						name : 'sumBoardVolume',
						type : 'float'
					}, {
						name : 'paperBoxVolume',
						type : 'float'
					}, {
						name : 'regionId',
						type : 'string'
					}, {
						name : 'sort',
						type : 'int'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductOutNotificationEntryView'
				},
				remoteFilter : true
			}
		});