// 表头，单分录模型
Ext.define('SCM.model.ConsignReturnProduct.ConsignReturnProductActionModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ConsignReturnProductActionModel',
			// 字段
			fields : ['head', 'updateEntrys', 'createEntrys', 'deleteEntrys'],
			proxy : {
				type : 'jsonajax',
				api : {
					create : '../../scm/control/createWithEntry?headEntity=ConsignReturnProduct&entryEntity=ConsignReturnProductEntry',
					update : '../../scm/control/updateWithEntry?headEntity=ConsignReturnProduct&entryEntity=ConsignReturnProductEntry'
				},
				reader : {
					type : 'json',
					root : ''
				},
				writer : {
					root : 'record',
					encode : true
					// 请求服务器时以param参数传进json数据
				}
			}
		});
