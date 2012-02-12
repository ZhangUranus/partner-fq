// 定义数据模型
Ext.define('SCM.model.WorkshopReturnProduct.WorkshopReturnProductDetailModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'WorkshopReturnProductDetailModel',
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
					read : '../../scm/control/requestJsonData?entity=ReturnProductWarehousingEntryExtra',
					create : '../../scm/control/addnewJsonData?entity=ReturnProductWarehousingEntryExtra',
					update : '../../scm/control/updateJsonData?entity=ReturnProductWarehousingEntryExtra',
					destroy : '../../scm/control/deleteJsonData?entity=ReturnProductWarehousingEntryExtra'
				}
			}
		});