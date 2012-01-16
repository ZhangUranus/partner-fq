// 定义数据模型
Ext.define('SCM.model.Supplier.SupplierEditModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'SupplierEditModel',
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
						name : 'createdStamp',
						defaultValue : new Date(),
						type : 'date',
						format : 'time',
						convert : function(value, record) {
							return new Date(value);
						},
						persist : false
					}, {
						name : 'lastUpdatedStamp',
						defaultValue : new Date(),
						type : 'date',
						format : 'time',
						convert : function(value, record) {
							return new Date(value);
						},
						persist : false
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=SupplierView',
					create : '../../scm/control/addnewJsonData?entity=Supplier',
					update : '../../scm/control/updateJsonData?entity=Supplier',
					destroy : '../../scm/control/deleteJsonData?entity=Supplier'
				},
				remoteFilter : true
			}
		});