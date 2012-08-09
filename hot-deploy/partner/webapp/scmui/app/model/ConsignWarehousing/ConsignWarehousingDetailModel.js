// 定义数据模型
Ext.define('SCM.model.ConsignWarehousing.ConsignWarehousingDetailModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ConsignWarehousingDetailModel',
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'parentId',
						type : 'string'
					}, {
						name : 'bomId',
						type : 'string'
					}, {
						name : 'materialId',
						type : 'string'
					}, {
						name : 'materialModel',
						type : 'string'
					}, {
						name : 'materialUnitId',
						type : 'string'
					}, {
						name : 'volume',
						type : 'float'
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
					read : '../../scm/control/requestJsonData?entity=ConsignPriceDetailView',
					create : '../../scm/control/addnewJsonData?entity=ConsignPriceDetail',
					update : '../../scm/control/updateJsonData?entity=ConsignPriceDetail',
					destroy : '../../scm/control/deleteJsonData?entity=ConsignPriceDetail'
				}
			}
		});