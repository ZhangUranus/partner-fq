Ext.define('SCM.store.basedata.MaterialBomEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.MaterialBomEditModel',
			alias : 'MaterialBomEditStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});