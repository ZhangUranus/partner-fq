// 定义数据模型
Ext.define('SCM.model.ProductOutNotification.ProductOutNotificationModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutNotificationModel',
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
						name : 'submitterSystemUserId',
						type : 'string'
					}, {
						name : 'submitterSystemUserName',
						type : 'string',
						persist : false
					}, {
						name : 'customerId',
						type : 'string'
					}, {
						name : 'deliverNumber',
						type : 'string'
					}, {
						name : 'customerNumber',
						type : 'string',
						persist : false
					}, {
						name : 'customerName',
						type : 'string',
						persist : false
					}, {
						name : 'customerContractor',
						type : 'string',
						persist : false
					}, {
						name : 'customerPhone',
						type : 'string',
						persist : false
					}, {
						name : 'customerAddress',
						type : 'string',
						persist : false
					}, {
						name : 'goodNumber',
						type : 'string'
					}, {
						name : 'planDeliveryDate',
						type : 'date',
						dateFormat : 'time'
					}, {
						name : 'planHouseNumber',
						type : 'string'
					}, {
						name : 'planContainerType',
						type : 'string'
					}, {
						name : 'inWarehouseName',
						type : 'string'
					}, {
						name : 'warehouseId',
						type : 'string'
					}, {
						name : 'warehouseName',
						type : 'string',
						persist : false
					}, {
						name : 'carNumber',
						type : 'string'
					}, {
						name : 'transferType',
						type : 'string'
					}, {
						name : 'finalHouseNumber',
						type : 'string'
					}, {
						name : 'finalContainerType',
						type : 'string'
					}, {
						name : 'finalContainerNumber',
						type : 'string'
					},{
						name : 'containerLength',
						type : 'float'
					}, {
						name : 'sealNumber',
						type : 'string'
					}, {
						name : 'arrivedTime',
						type : 'date',
						dateFormat : 'time'
					}, {
						name : 'packagedNotSend',
						type : 'string'
					}, {
						name : 'leaveTime',
						type : 'date',
						dateFormat : 'time'
					}, {
						name : 'grossWeight',
						type : 'float'
					}, {
						name : 'tareWeight',
						type : 'float'
					}, {
						name : 'neatWeight',
						type : 'float'
					}, {
						name : 'isFinished',
						type : 'string'
					}],
			// ,idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductOutNotificationView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=ProductOutNotification&entryEntity=ProductOutNotificationEntry&cascadeDelete=ProductOutNotificationEntryDetail'
				},
				remoteFilter : true
			}
		});