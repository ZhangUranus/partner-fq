Ext.define('SCM.store.basedata.MaterialBomEditEntryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.MaterialBomEditEntryModel',
			alias : 'MaterialBomEditEntryStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'entryMaterialName',
				direction : 'ASC'
			}]
		});