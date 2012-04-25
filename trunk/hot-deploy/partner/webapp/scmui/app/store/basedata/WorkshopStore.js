Ext.define('SCM.store.basedata.WorkshopStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.WorkshopModel',
			alias : 'WorkshopStore',
			pageSize : SCM.pageSize, //每页行数
			remoteSort : true, //服务器排序
			autoLoad : true,
			autoSync : true,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});