// 定义数据模型
Ext.define('SCM.model.ProductOutwarehouse.ProductOutwarehouseModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutwarehouseModel',
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
						name : 'workshopWorkshopId',
						type : 'string'
					}, {
						name : 'workshopWorkshopName',
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
						name : 'volume',
						defaultValue : 1,
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
					}, {
						name : 'barcode1',
						type : 'string'
					}, {
						name : 'barcode2',
						type : 'string'
					}, {
						name : 'outwarehouseType',
						type : 'string'
					}, {
						name : 'prdWeek',
						type : 'string'
					}, {
						name : 'qantity',
						type : 'int'
					}, {
						name : 'goodNumber',
						type : 'string'
					}, {
						name : 'destinhouseNumber',
						type : 'string'
					}, {
						name : 'containerNumber',
						type : 'string'
					}, {
						name : 'sealNumber',
						type : 'string'
					}],
			// ,idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductOutwarehouseView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=ProductOutwarehouse&entryEntity=ProductOutwarehouseEntry'
				},
				remoteFilter : true
			}
		});