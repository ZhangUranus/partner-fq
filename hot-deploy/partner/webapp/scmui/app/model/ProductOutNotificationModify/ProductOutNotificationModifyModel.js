// 定义计量单位数据模型
Ext.define('SCM.model.ProductOutNotificationModify.ProductOutNotificationModifyModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutNotificationModifyModel',
			fields : [// 字段
			        {
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'operateType',
						type : 'int'
					}, {
						name : 'deliverNumber',
						type : 'string'
					}, {
						name : 'goodNumber',
						type : 'string'
					}, {
						name : 'materialId',
						type : 'string'
					}, {
						name : 'materialName',
						type : 'string'
					}, {
						name : 'notificationEntryId',
						type : 'string'
					}, {
						name : 'notificationMaterialName',
						type : 'string'
					}, {
						name : 'notificationMaterialNumber',
						type : 'string'
					}, {
						name : 'volume',
						type : 'float'
					}, {
						name : 'verifyEntryId',
						type : 'string'
					}, {
						name : 'verifyEntryMaterialName',
						type : 'string'
					}, {
						name : 'verifyEntryMaterialNumber',
						type : 'string'
					}, {
						name : 'verifyEntryVolume',
						type : 'float'
					}, {
						name : 'note',
						type : 'string'
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : 'submitterSystemUserId',
						type : 'string'
					}, {
						name : 'submitterSystemUserName',
						type : 'string',
						persist : false
					}, {
						name : 'createdStamp',
						defaultValue : new Date(),
						type : 'date',
						format : 'time',
						convert : function(value, record) {
							return new Date(value);
						},
						persist : false
					}, {
						name : 'lastUpdatedStamp',
						defaultValue : new Date(),
						type : 'date',
						format : 'time',
						convert : function(value, record) {
							return new Date(value);
						},
						persist : false
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductOutNotificationModifyView',
					create : '../../scm/control/addnewJsonData?entity=ProductOutNotificationModify',
					update : '../../scm/control/updateJsonData?entity=ProductOutNotificationModify',
					destroy : '../../scm/control/deleteJsonData?entity=ProductOutNotificationModify'
				},
				extraParams : {
					queryField : 'number,goodNumber'
				}
			}
		});