// 定义数据模型
Ext.define('SCM.model.PurchaseBill.PurchaseBillModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'PurchaseBillModel',
			// 字段
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'emptyId',
						type : 'string',
						persist : false
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'bizDate',
						type : 'date',
						dateFormat : 'time'
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
						name : 'entryId',
						type : 'string'
					}, {
						name : 'materialMaterialId',
						type : 'string'
					}, {
						name : 'materialMaterialName',
						type : 'string',
						persist : false
					}, {
						name : 'materialMaterialModel',
						type : 'string'
					}, {
						name : 'volume',
						type : 'float'
					}, {
						name : 'unitUnitId',
						type : 'string'
					}, {
						name : 'unitUnitName',
						type : 'string',
						persist : false
					}, {
						name : 'price',
						type : 'float'
					}, {
						name : 'refPrice',
						type : 'float'
					}, {
						name : 'entrysum',
						type : 'float'
					}],
			// ,idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=PurchaseBillView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=PurchaseBill&entryEntity=PurchaseBillEntry'
				},
				remoteFilter : true
			}
		});