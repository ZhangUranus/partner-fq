Ext.define('SCM.store.rpt.PackingMaterialDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.PackingMaterialDetailModel',
			alias : 'PackingMaterialDetailStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据MATERIALNUMBER字段排序
				property : 'MATERIALNUMBER',
				direction : 'ASC'
			}]
		});