Ext.define('SCM.store.ProductOutwarehouse.ProductOutDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutwarehouse.ProductOutDetailModel',
			alias : 'ProductOutDetailStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据sort字段排序
				property : 'goodNumber',
				direction : 'ASC'
			}]
		});