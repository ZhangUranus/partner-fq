//表头，单分录模型
Ext.define('SCM.model.PurchaseBill.PurchaseBillActionModel', {
    extend: 'Ext.data.Model',
    alias: 'PurchaseBillActionModel',
    //字段
    fields: [
		'head',
		'updateEntrys',
		'createEntrys',
		'deleteEntrys'
    ],
	proxy:{
		type : 'ajax',   
		api : {   
				create: '../../scm/control/createWithEntry?headEntity=PurchaseBill&entryEntity=PurchaseBillEntry',
				update: '../../scm/control/updateWithEntry?headEntity=PurchaseBill&entryEntity=PurchaseBillEntry'
		},   
		writer : {   
					type : 'json',
					root: 'record',
					encode: true //请求服务器时以param参数传进json数据
		},   
		reader : {   
					type : 'json'  
		}  
	}
});
