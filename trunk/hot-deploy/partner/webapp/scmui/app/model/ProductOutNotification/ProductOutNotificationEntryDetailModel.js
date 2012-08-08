// 定义数据模型
Ext.define('SCM.model.ProductOutNotification.ProductOutNotificationEntryDetailModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutNotificationEntryDetailModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'parentId',
						type : 'string'
					}, {
						name : 'materialId',
						type : 'string'
					}, {
						name : 'materialName',
						type : 'string',
						persist : false
					}, {
						name : 'orderQty',
						type : 'float'
					}, {
						name : 'sentQty',
						type : 'float'
					}, {
						name : 'verifyContainerType',
						type : 'string'
					}, {
						name : 'warehouseId',
						type : 'string'
					}, {
						name : 'warehouseName',
						type : 'string',
						persist : false
					}, {
						name : 'isFinished',
						defaultValue : 'N',
						type : 'string'
					}, {
						name : 'sort',
						type : 'int'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductOutNotificationEntryDetailView',
					create : '../../scm/control/addnewJsonData?entity=ProductOutNotificationEntryDetail',
					update : '../../scm/control/updateJsonData?entity=ProductOutNotificationEntryDetail',
					destroy : '../../scm/control/deleteJsonData?entity=ProductOutNotificationEntryDetail'
				}
			}
		});