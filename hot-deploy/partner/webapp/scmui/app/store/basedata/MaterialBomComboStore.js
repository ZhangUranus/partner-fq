Ext.define('SCM.store.basedata.MaterialBomComboStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.MaterialBomComboModel',
			alias : 'MaterialBomComboStore',
			autoLoad : true,
			autoSync : false,
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