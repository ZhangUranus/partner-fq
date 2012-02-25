// 表头，单分录模型
Ext.define('SCM.model.PurchaseReturn.PurchaseReturnActionModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'PurchaseReturnActionModel',
			// 字段
			fields : ['head', 'updateEntrys', 'createEntrys', 'deleteEntrys'],
			proxy : {
				type : 'jsonajax',
				api : {
					create : '../../scm/control/createWithEntry?headEntity=PurchaseReturn&entryEntity=PurchaseReturnEntry',
					update : '../../scm/control/updateWithEntry?headEntity=PurchaseReturn&entryEntity=PurchaseReturnEntry'
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
