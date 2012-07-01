Ext.define('SCM.store.SupplierStockAdjust.SupplierStockAdjustEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.SupplierStockAdjust.SupplierStockAdjustEditModel',
			alias : 'SupplierStockAdjustEditStore',
			autoLoad : false,
			autoSync : false,
			pageSize : SCM.billPageSize, // 每页行数
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});