//表头，单分录模型
Ext.define('SCM.model.PurchaseBill.PurchaseBillActionModel', {
    extend: 'Ext.data.Model',
    requires: ['SCM.extend.proxy.JsonAjax'],
    alias: 'PurchaseBillActionModel',
    //字段
    fields: [
		'head',
		'updateEntrys',
		'createEntrys',
		'deleteEntrys'
    ],
	proxy:{
		type : 'jsonajax',   
		api : {
			create: '../../scm/control/createWithEntry?headEntity=PurchaseBill&entryEntity=PurchaseBillEntry',
			update: '../../scm/control/updateWithEntry?headEntity=PurchaseBill&entryEntity=PurchaseBillEntry'
		},   
		reader : {
			type : 'json',
			root : ''
		},
		writer : {
			root: 'record',
			encode: true //请求服务器时以param参数传进json数据
		}
	}
});
