// 定义数据模型
Ext.define('SCM.model.ProductOutVerify.ProductOutVerifyEditEntryModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutVerifyEditEntryModel',
			// 字段
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'deliverNumber',
						type : 'string'
					}, {
						name : 'parentMaterialId',
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
					read : '../../scm/control/requestJsonData?entity=ProductOutVerifyEntryView'
				},
				remoteFilter : true
			}
		});