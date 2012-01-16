Ext.define('SCM.store.Supplier.SupplierEditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.Supplier.SupplierEditModel',
			alias : 'SupplierEditStore',
			pageSize : 20, //每页行数
			remoteSort : true, //服务器排序
			autoLoad : false,
			autoSync : true
		});