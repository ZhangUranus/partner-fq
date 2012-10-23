// 表头，单分录模型
Ext.define('SCM.model.ProductManualOutwarehouse.ProductManualOutwarehouseActionModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ProductManualOutwarehouseActionModel',
			// 字段
			fields : ['head', 'updateEntrys', 'createEntrys', 'deleteEntrys'],
			proxy : {
				type : 'jsonajax',
				api : {
					create : '../../scm/control/createWithEntry?headEntity=ProductManualOutwarehouse&entryEntity=ProductManualOutwarehouseEntry',
					update : '../../scm/control/updateWithEntry?headEntity=ProductManualOutwarehouse&entryEntity=ProductManualOutwarehouseEntry'
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
