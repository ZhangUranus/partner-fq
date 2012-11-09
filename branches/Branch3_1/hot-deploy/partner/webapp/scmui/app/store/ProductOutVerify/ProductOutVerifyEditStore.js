Ext.define('SCM.store.ProductOutVerify.ProductOutVerifyEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutVerify.ProductOutVerifyEditModel',
			alias : 'ProductOutVerifyEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'deliverNumber',
				direction : 'ASC'
			}]
		});