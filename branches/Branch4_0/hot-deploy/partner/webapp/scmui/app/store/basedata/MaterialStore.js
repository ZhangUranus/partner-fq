Ext.define('SCM.store.basedata.MaterialStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.MaterialModel',
			alias : 'MaterialStore',
			pageSize : SCM.pageSize, // 每页行数
			remoteFilter:true,//服务器过滤
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : true,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});