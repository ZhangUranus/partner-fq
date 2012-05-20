// 定义数据模型
Ext.define('SCM.model.WorkshopDrawMaterial.WorkshopDrawMaterialEditModel', {
	extend : 'Ext.data.Model',
	requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
	alias : 'WorkshopDrawMaterialEditModel',
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
			read : '../../scm/control/requestJsonData?entity=WorkshopDrawMaterialView&distinct=true&fields=id,number,bizDate,workshopWorkshopId,workshopWorkshopName,issuerSystemUserId,issuerSystemUserName,submitterSystemUserId,submitterSystemUserName,totalsum,createdStamp,lastUpdatedStamp,note,status',
			destroy : '../../scm/control/deleteWithEntry?headEntity=WorkshopDrawMaterial&entryEntity=WorkshopDrawMaterialEntry'
		},
		remoteFilter : true
	}
});