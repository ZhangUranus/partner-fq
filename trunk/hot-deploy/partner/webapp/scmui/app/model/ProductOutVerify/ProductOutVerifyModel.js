// 定义数据模型
Ext.define('SCM.model.ProductOutVerify.ProductOutVerifyModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutVerifyModel',
			// 字段
			fields : [{
						name : 'deliverNumber',
						type : 'string'
					}, {
						name : 'bizDate',
						type : 'date',
						defaultValue : new Date(),
						convert : function(value, record) {
							return new Date(value);
						}
					}, {
						name : 'materialId',
						type : 'string'
					}, {
						name : 'materialName',
						type : 'string',
						persist : false
					}, {
						name : 'destinationId',
						type : 'string',
						persist : false
					}, {
						name : 'regionId',
						type : 'string',
						persist : false
					}, {
						name : 'sumVolume',
						type : 'float',
						persist : false
					}, {
						name : 'sumGrossWeight',
						type : 'float',
						persist : false
					}, {
						name : 'sumGrossSize',
						type : 'float',
						persist : false
					}, {
						name : 'sumBoardVolume',
						type : 'float'
					}, {
						name : 'paperBoxVolume',
						type : 'float'
					}, {
						name : 'status',
						type : 'int'
					}],
			// ,idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/getProductOutVerifyHead',
					destroy : '../../scm/control/deleteWithEntry?headEntity=ProductOutVerifyHead&entryEntity=ProductOutVerifyEntry'
				},
				remoteFilter : true
			}
		});