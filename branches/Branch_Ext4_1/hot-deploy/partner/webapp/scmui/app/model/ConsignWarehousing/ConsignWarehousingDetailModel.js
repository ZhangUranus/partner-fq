// 定义数据模型
Ext.define('SCM.model.ConsignWarehousing.ConsignWarehousingDetailModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'ConsignWarehousingDetailModel',
			fields : [{
						name : 'parentId',
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
					read : '../../scm/control/requestJsonData?entity=ConsignPriceDetailView'
				}
			}
		});