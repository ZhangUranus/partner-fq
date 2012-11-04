// 表头，单分录模型
Ext.define('SCM.model.ProductOutVerify.ProductOutVerifyActionModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ProductOutVerifyActionModel',
			// 字段
			fields : ['head', 'updateEntrys', 'createEntrys', 'deleteEntrys'],
			proxy : {
				type : 'jsonajax',
				api : {
					update : '../../scm/control/saveVerifyBill'
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
