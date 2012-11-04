// 定义数据模型
Ext.define('SCM.model.ProductOutVerify.ProductOutVerifyHeadModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator','SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutVerifyHeadModel',
			// 字段
			fields : [{
						name : 'deliverNumber',
						type : 'string'
					},{
						name : 'bizDate',
						type : 'date',
						defaultValue : new Date(),
						convert : function(value, record) {
							return new Date(value);
						}
					},{
						name : 'materialId',
						type : 'string'
					}, {
						name : 'materialName',
						type : 'string',
						persist : false
					},{
						name : 'destinationId',
						type : 'string',
						persist : false
					},{
						name : 'regionId',
						type : 'string',
						persist : false
					},{
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
					},{
						name : 'status',
						type : 'int'
					}
					],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/getProductOutVerifyHead'
				},
				remoteFilter : true
			}
		});