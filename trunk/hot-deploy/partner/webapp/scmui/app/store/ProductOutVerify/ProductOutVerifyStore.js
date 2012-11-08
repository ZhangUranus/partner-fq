Ext.define('SCM.store.ProductOutVerify.ProductOutVerifyStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutVerify.ProductOutVerifyModel',
			alias : 'ProductOutVerifyStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'deliverNumber',
				direction : 'ASC'
			}]
		});