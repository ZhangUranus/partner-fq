Ext.define('SCM.store.rpt.PackingMaterialDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.PackingMaterialDetailModel',
			alias : 'PackingMaterialDetailStore',
			pageSize : SCM.unpageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据MATERIALNUMBER字段排序
				property : 'MATERIALNUMBER',
				direction : 'ASC'
			}]
		});