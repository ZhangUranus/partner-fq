// 定义数据模型
Ext.define('SCM.model.ProductInwarehouse.ProductInwarehouseEditEntryModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductInwarehouseEditEntryModel',
			// 字段
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'parentId',
						type : 'string'
					}, {
						name : 'productWeek',
						type : 'string'
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
						name : 'materialMaterialId',
						type : 'string'
					}, {
						name : 'materialMaterialName',
						type : 'string',
						persist : false
					}, {
						name : 'materialModel',
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
						name : 'qantity',
						type : 'int'
					}, {
						name : 'inwarehouseType',
						type : 'string'
					}, {
						name : 'sort',
						type : 'int'
					}, {
						name : 'isOut',
						defaultValue : 0,
						type : 'int'
					}, {
						name : 'lastUpdatedStamp',
						defaultValue : new Date(),
						type : 'date',
						format : 'time',
						convert : function(value, record) {
							return new Date(value);
						},
						persist : false
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductInwarehouseEntryView'
				},
				remoteFilter : true
			}
		});