// 定义数据模型
Ext.define('SCM.model.ConsignDrawMaterial.ConsignDrawMaterialModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ConsignDrawMaterialModel',
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
						name : 'processorSupplierId',
						type : 'string'
					}, {
						name : 'processorSupplierName',
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
						name : 'processedMaterialMaterialId',
						type : 'string'
					}, {
						name : 'processedMaterialMaterialName',
						type : 'string',
						persist : false
					}, {
						name : 'materialVolume',
						type : 'float'
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
					read : '../../scm/control/requestJsonData?entity=ConsignDrawMaterialView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=ConsignDrawMaterial&entryEntity=ConsignDrawMaterialEntry'
				},
				remoteFilter : true
			}
		});