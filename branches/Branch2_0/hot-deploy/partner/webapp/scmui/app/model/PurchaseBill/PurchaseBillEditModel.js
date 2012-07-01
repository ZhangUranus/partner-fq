// 定义数据模型
Ext.define('SCM.model.PurchaseBill.PurchaseBillEditModel', {
	extend : 'Ext.data.Model',
	requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
	alias : 'PurchaseBillEditModel',
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
				name : 'supplierSupplierId',
				type : 'string'
			}, {
				name : 'supplierSupplierName',
				type : 'string',
				persist : false
			}, {
				name : 'submitUserId',
				type : 'string'
			}, {
				name : 'submitUserName',
				type : 'string'
			}, {
				name : 'buyerSystemUserId',
				type : 'string'
			}, {
				name : 'buyerSystemUserName',
				type : 'string',
				persist : false
			}, {
				name : 'approverSystemUserId',
				type : 'string'
			}, {
				name : 'approverSystemUserName',
				type : 'string',
				persist : false
			}, {
				name : 'totalsum',
				type : 'float'
			}, {
				name : 'receiveStamp',
				type : 'date',
				defaultValue : new Date(),
				convert : function(value, record) {
					return new Date(value);
				}
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
				name : 'approverNote',
				type : 'string'
			}, {
				name : 'status',
				type : 'int'
			}],
	idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
	proxy : {
		type : 'jsonajax',
		api : {
			read : '../../scm/control/requestJsonData?entity=PurchaseBillView&distinct=true&fields=id,number,bizDate,supplierSupplierId,supplierSupplierName,submitUserId,submitUserName,buyerSystemUserId,buyerSystemUserName,approverSystemUserId,approverSystemUserName,totalsum,receiveStamp,createdStamp,lastUpdatedStamp,note,approverNote,status',
			destroy : '../../scm/control/deleteWithEntry?headEntity=PurchaseBill&entryEntity=PurchaseBillEntry'
		},
		remoteFilter : true
	}
});