Ext.define('SCM.store.Supplier.SupplierStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.Supplier.SupplierModel',
			alias : 'SupplierStore',
			autoLoad : true,
			autoSync : false,
			groupField : 'number',
			sorters : [{// 根据number字段排序
				property : 'number',
				direction : 'ASC'
			}]
		});