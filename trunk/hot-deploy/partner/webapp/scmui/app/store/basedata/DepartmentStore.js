Ext.define('SCM.store.basedata.DepartmentStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.DepartmentModel',
			alias : 'DepartmentStore',
			pageSize : 20, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});