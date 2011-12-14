//表头，单分录模型
Ext.define('SCM.model.basedata.MaterialBomActionModel', {
    extend: 'Ext.data.Model',
    alias: 'MaterialBomActionModel',
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
				create: '../../scm/control/createWithEntry?headEntity=MaterialBom&entryEntity=MaterialBomEntry',
				update: '../../scm/control/updateWithEntry?headEntity=MaterialBom&entryEntity=MaterialBomEntry'
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
