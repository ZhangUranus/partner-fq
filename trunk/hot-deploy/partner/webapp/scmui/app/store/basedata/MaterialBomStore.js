Ext.define('SCM.store.basedata.MaterialBomStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.MaterialBomModel',
			alias : 'MaterialBomStore',
			pageSize : SCM.pageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});