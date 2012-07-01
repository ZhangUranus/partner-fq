Ext.define('SCM.store.SupplierStockAdjust.SupplierStockAdjustStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.SupplierStockAdjust.SupplierStockAdjustModel',
			alias : 'SupplierStockAdjustStore',
			autoLoad : false,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});