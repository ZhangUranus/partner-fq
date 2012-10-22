// 表头，单分录模型
Ext.define('SCM.model.StockAdjust.StockAdjustActionModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'StockAdjustActionModel',
			// 字段
			fields : ['head', 'updateEntrys', 'createEntrys', 'deleteEntrys'],
			proxy : {
				type : 'jsonajax',
				api : {
					create : '../../scm/control/createWithEntry?headEntity=StockAdjust&entryEntity=StockAdjustEntry',
					update : '../../scm/control/updateWithEntry?headEntity=StockAdjust&entryEntity=StockAdjustEntry'
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
