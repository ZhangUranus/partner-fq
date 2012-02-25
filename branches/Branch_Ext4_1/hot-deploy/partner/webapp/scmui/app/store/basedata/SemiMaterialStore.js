Ext.define('SCM.store.basedata.SemiMaterialStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.SemiMaterialModel',
			alias : 'SemiMaterialStore',
			pageSize : 20, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});