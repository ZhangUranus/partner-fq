// 定义数据模型
Ext.define('SCM.model.ProductInwarehouse.ProductInwarehouseEditModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductInwarehouseEditModel',
			// 字段
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'bizDate',
						type : 'date',
						defaultValue : new Date(),
						convert : function(value, record) {
							return new Date(value);
						}
					}, {
						name : 'inspectorSystemUserId',
						type : 'string'
					}, {
						name : 'inspectorSystemUserName',
						type : 'string',
						persist : false
					}, {
						name : 'submitterSystemUserId',
						type : 'string'
					}, {
						name : 'submitterSystemUserName',
						type : 'string',
						persist : false
					}, {
						name : 'totalsum',
						type : 'float'
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
					}, {
						name : 'note',
						type : 'string'
					}, {
						name : 'status',
						type : 'int'
					}, {
						name : 'billType',
						type : 'int',
						defaultValue : 1
					}
			],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductInwarehouseView&distinct=true&fields=id,number,bizDate,inspectorSystemUserId,inspectorSystemUserName,submitterSystemUserId,submitterSystemUserName,totalsum,createdStamp,lastUpdatedStamp,note,status,billType',
					destroy : '../../scm/control/deleteWithEntry?headEntity=ProductInwarehouse&entryEntity=ProductInwarehouseEntry&cascadeDelete=ProductInwarehouseEntryDetail'
				},
				remoteFilter : true
			}
		});