// 表头，单分录模型
Ext.define('SCM.model.ConsignWarehousing.ConsignWarehousingActionModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ConsignWarehousingActionModel',
			// 字段
			fields : ['head', 'updateEntrys', 'createEntrys', 'deleteEntrys'],
			proxy : {
				type : 'jsonajax',
				api : {
					create : '../../scm/control/createWithEntry?headEntity=ConsignWarehousing&entryEntity=ConsignWarehousingEntry',
					update : '../../scm/control/updateWithEntry?headEntity=ConsignWarehousing&entryEntity=ConsignWarehousingEntry'
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
