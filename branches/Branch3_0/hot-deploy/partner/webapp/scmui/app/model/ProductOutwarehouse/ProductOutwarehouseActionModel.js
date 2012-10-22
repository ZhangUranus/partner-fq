// 表头，单分录模型
Ext.define('SCM.model.ProductOutwarehouse.ProductOutwarehouseActionModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutwarehouseActionModel',
			fields : ['head', 'updateEntrys', 'createEntrys', 'deleteEntrys'],
			proxy : {
				type : 'jsonajax',
				api : {
					create : '../../scm/control/createWithEntry?headEntity=ProductOutwarehouse&entryEntity=ProductOutwarehouseEntry',
					update : '../../scm/control/updateWithEntry?headEntity=ProductOutwarehouse&entryEntity=ProductOutwarehouseEntry'
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
