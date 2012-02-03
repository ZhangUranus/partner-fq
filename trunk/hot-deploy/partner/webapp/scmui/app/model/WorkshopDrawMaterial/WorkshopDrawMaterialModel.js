// 定义数据模型
Ext.define('SCM.model.WorkshopDrawMaterial.WorkshopDrawMaterialModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'WorkshopDrawMaterialModel',
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
						name : 'workshopWorkshopId',
						type : 'string'
					}, {
						name : 'workshopWorkshopName',
						type : 'string',
						persist : false
					}, {
						name : 'issuerSystemUserId',
						type : 'string'
					}, {
						name : 'issuerSystemUserName',
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
						name : 'entryId',
						type : 'string'
					}, {
						name : 'warehouseWarehouseId',
						type : 'string'
					}, {
						name : 'warehouseWarehouseName',
						type : 'string',
						persist : false
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
						name : 'stockVolume',
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
						name : 'entrysum',
						type : 'float'
					}],
			// ,idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=WorkshopDrawMaterialView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=WorkshopDrawMaterial&entryEntity=WorkshopDrawMaterialEntry'
				},
				remoteFilter : true
			}
		});