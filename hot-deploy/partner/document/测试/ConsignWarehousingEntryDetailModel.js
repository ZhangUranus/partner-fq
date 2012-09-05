// 定义数据模型
Ext.define('SCM.model.ConsignWarehousing.ConsignWarehousingEntryDetailModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ConsignWarehousingEntryDetailModel',
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
						type : 'float'
					}, {
						name : 'entrysum',
						type : 'float'
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ConsignWarehousingEntryExtra',
					create : '../../scm/control/addnewJsonData?entity=ConsignWarehousingEntryExtra',
					update : '../../scm/control/updateJsonData?entity=ConsignWarehousingEntryExtra',
					destroy : '../../scm/control/deleteJsonData?entity=ConsignWarehousingEntryExtra'
				}
			}
		});