// 定义数据模型
Ext.define('SCM.model.ConsignReturnProduct.ConsignReturnProductModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ConsignReturnProductModel',
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
						name : 'returnerSystemUserId',
						type : 'string'
					}, {
						name : 'returnerSystemUserName',
						type : 'string',
						persist : false
					}, {
						name : 'checkerSystemUserId',
						type : 'string'
					}, {
						name : 'checkerSystemUserName',
						type : 'string',
						persist : false
					}, {
						name : 'checkStatus',
						type : 'int',
						defaultValue : 0
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
						name : 'currentCheckVolume',
						type : 'float'
					}, {
						name : 'checkedVolume',
						type : 'float'
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
						name : 'entrysum',
						type : 'float'
					}],
			// ,idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ConsignReturnProductView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=ConsignReturnProduct&entryEntity=ConsignReturnProductEntry'
				},
				remoteFilter : true
			}
		});