// 定义数据模型
Ext.define('SCM.model.ProductInwarehouse.ProductInwarehouseCheckModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductInwarehouseCheckModel',
			fields : [{
						name : 'workshopId',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'materialId',
						type : 'string'
					}, {
						name : 'volume',
						type : 'float'
					}, {
						name : 'needVolume',
						type : 'float'
					}, {
						name : 'isEnough',
						type : 'boolean'
					}]
		});