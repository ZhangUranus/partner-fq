// 定义数据模型
Ext.define('SCM.model.ProductOutwarehouse.ProductOutwarehouseEditEntryModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutwarehouseEditEntryModel',
			// 字段
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'parentId',
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
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductOutwarehouseEntryView'
				},
				remoteFilter : true
			}
		});