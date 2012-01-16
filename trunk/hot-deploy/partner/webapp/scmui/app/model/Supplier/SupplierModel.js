// 定义数据模型
Ext.define('SCM.model.Supplier.SupplierModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'SupplierModel',
			fields : [// 字段
			{
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}, {
						name : 'phoneNum',
						type : 'string'
					}, {
						name : 'address',
						type : 'string'
					}, {
						name : 'entryId',
						type : 'string'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=SupplierView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=Supplier&entryEntity=SupplierEntry'
				},
				remoteFilter : true
			}
		});