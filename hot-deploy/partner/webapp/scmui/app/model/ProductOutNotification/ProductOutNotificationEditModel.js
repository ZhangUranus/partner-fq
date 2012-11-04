// 定义数据模型
Ext.define('SCM.model.ProductOutNotification.ProductOutNotificationEditModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutNotificationEditModel',
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
					},{
						name : 'deliverNumber',
						type : 'string'
					},{
						name : 'goodNumber',
						type : 'string'
					}, {
						name : 'planDeliveryDate',
						type : 'date',
						defaultValue : new Date(),
						convert : function(value, record) {
							return new Date(value);
						}
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
					}, {
						name : 'sealNumber',
						type : 'string'
					}, {
						name : 'arrivedTime',
						type : 'date',
						defaultValue : new Date(),
						convert : function(value, record) {
							return new Date(value);
						}
					}, {
						name : 'packagedNotSend',
						type : 'string'
					}, {
						name : 'leaveTime',
						type : 'date',
						defaultValue : new Date(),
						convert : function(value, record) {
							return new Date(value);
						}
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
					read : '../../scm/control/requestJsonData?entity=ProductOutNotificationView&distinct=true&fields=id,number,bizDate,submitterSystemUserId,submitterSystemUserName,customerId,customerNumber,customerName,customerContractor,customerPhone,customerAddress,goodNumber,planDeliveryDate,planHouseNumber,planContainerType,inWarehouseName,warehouseId,warehouseName,carNumber,transferType,finalHouseNumber,finalContainerType,finalContainerNumber,sealNumber,arrivedTime,packagedNotSend,leaveTime,grossWeight,tareWeight,neatWeight,isFinished,createdStamp,lastUpdatedStamp,note,status',
					destroy : '../../scm/control/deleteWithEntry?headEntity=ProductOutNotification&entryEntity=ProductOutNotificationEntry&cascadeDelete=ProductOutNotificationEntryDetail'
				},
				remoteFilter : true
			}
		});