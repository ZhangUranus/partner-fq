// 定义数据模型,进仓确认单
Ext.define('SCM.model.ProductOutwarehouseConfirm.ProductOutwarehouseConfirmModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutwarehouseConfirmModel',
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
						name : 'workshopWorkshopId',
						type : 'string'
					}, {
						name : 'workshopWorkshopName',
						type : 'string',
						persist : false
					}, {
						name : 'warehouseWarehouseId',
						type : 'string'
					}, {
						name : 'warehouseWarehouseName',
						type : 'string',
						persist : false
					}, {
						name : 'prdWeek',
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
						type : 'string',
						persist : false
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
						name : 'qantity',
						type : 'float'
					}, {
						name : 'goodNumber',
						type : 'string'
					}, {
						name : 'destinhouseNumber',
						type : 'string'
					}, {
						name : 'status',
						type : 'int'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductOutwarehouseConfirmView',
					update : '../../scm/control/updateJsonData?entity=ProductOutwarehouseConfirm',
					destroy : '../../scm/control/deleteJsonData?entity=ProductOutwarehouseConfirm'
				},
				remoteFilter : true
			}
		});