// 定义数据模型
Ext.define('SCM.model.PurchaseReturn.PurchaseReturnEditModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'PurchaseReturnEditModel',
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
						name : 'type',
						type : 'int',
						defaultValue : 1
					}, {
						name : 'supplierSupplierId',
						type : 'string'
					}, {
						name : 'supplierSupplierName',
						type : 'string',
						persist : false
					}, {
						name : 'returnerSystemUserId',
						type : 'string'
					}, {
						name : 'returnerSystemUserName',
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
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=PurchaseReturnView&distinct=true&fields=id,number,bizDate,type,supplierSupplierId,supplierSupplierName,returnerSystemUserId,returnerSystemUserName,submitterSystemUserId,submitterSystemUserName,totalsum,createdStamp,lastUpdatedStamp,note,status',
					destroy : '../../scm/control/deleteWithEntry?headEntity=PurchaseReturn&entryEntity=PurchaseReturnEntry'
				},
				remoteFilter : true
			}
		});