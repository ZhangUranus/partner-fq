// 表头，单分录模型
Ext.define('SCM.model.SupplierStockAdjust.SupplierStockAdjustActionModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'SupplierStockAdjustActionModel',
			// 字段
			fields : ['head', 'updateEntrys', 'createEntrys', 'deleteEntrys'],
			proxy : {
				type : 'jsonajax',
				api : {
					create : '../../scm/control/createWithEntry?headEntity=SupplierStockAdjust&entryEntity=SupplierStockAdjustEntry',
					update : '../../scm/control/updateWithEntry?headEntity=SupplierStockAdjust&entryEntity=SupplierStockAdjustEntry'
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
