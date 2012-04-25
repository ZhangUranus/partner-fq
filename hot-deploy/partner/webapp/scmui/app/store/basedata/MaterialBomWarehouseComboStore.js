Ext.define('SCM.store.basedata.MaterialBomWarehouseComboStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.basedata.MaterialBomWarehouseComboModel',
			alias : 'MaterialBomWarehouseComboStore',
			pageSize : SCM.unpageSize, // 每页行数
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