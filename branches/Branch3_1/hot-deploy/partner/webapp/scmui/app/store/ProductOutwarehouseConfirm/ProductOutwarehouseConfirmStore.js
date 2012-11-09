Ext.define('SCM.store.ProductOutwarehouseConfirm.ProductOutwarehouseConfirmStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductOutwarehouseConfirm.ProductOutwarehouseConfirmModel',
			alias : 'ProductOutwarehouseConfirmStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据number字段排序
				property : 'bizDate',
				direction : 'ASC'
			}]
		});