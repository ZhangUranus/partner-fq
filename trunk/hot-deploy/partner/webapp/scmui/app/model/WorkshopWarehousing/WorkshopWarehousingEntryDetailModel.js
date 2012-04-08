// 定义数据模型
Ext.define('SCM.model.WorkshopWarehousing.WorkshopWarehousingEntryDetailModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'WorkshopWarehousingEntryDetailModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'entryId',
						type : 'string'
					}, {
						name : 'materialMaterialId',
						type : 'string'
					}, {
						name : 'materialMaterialModel',
						type : 'string'
					}, {
						name : 'volume',
						type : 'string'
					}, {
						name : 'unitUnitId',
						type : 'string'
					}, {
						name : 'price',
						type : 'string'
					}, {
						name : 'entrysum',
						type : 'string'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=WorkshopWarehousingEntryExtra',
					create : '../../scm/control/addnewJsonData?entity=WorkshopWarehousingEntryExtra',
					update : '../../scm/control/updateJsonData?entity=WorkshopWarehousingEntryExtra',
					destroy : '../../scm/control/deleteJsonData?entity=WorkshopWarehousingEntryExtra'
				}
			}
		});