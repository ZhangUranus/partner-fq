Ext.define('SCM.store.basedata.ProductComboValidStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.ProductComboModel',
			alias : 'ProductComboValidStore',
			pageSize : SCM.unpageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}],
			filters : [{
			    property: 'status',
			    value   : 1
			}, {
			    property: 'valid',
			    value   : 'Y'
			}]
		});