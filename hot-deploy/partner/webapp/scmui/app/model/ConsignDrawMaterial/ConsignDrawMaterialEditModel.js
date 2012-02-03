// 定义数据模型
Ext.define('SCM.model.ConsignDrawMaterial.ConsignDrawMaterialEditModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ConsignDrawMaterialEditModel',
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
					read : '../../scm/control/requestJsonData?entity=ConsignDrawMaterialView&distinct=true&fields=id,number,bizDate,processorSupplierId,processorSupplierName,issuerSystemUserId,issuerSystemUserName,processedMaterialMaterialId,processedMaterialMaterialName,materialVolume,totalsum,createdStamp,lastUpdatedStamp,note,status',
					destroy : '../../scm/control/deleteWithEntry?headEntity=ConsignDrawMaterial&entryEntity=ConsignDrawMaterialEntry'
				},
				remoteFilter : true
			}
		});