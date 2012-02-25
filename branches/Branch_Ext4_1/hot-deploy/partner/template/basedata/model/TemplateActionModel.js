//表头，单分录模型
Ext.define('SCM.model.${TemplateName}.${TemplateName}ActionModel', {
    extend: 'Ext.data.Model',
    alias: '${TemplateName}ActionModel',
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
				create: '../../scm/control/createWithEntry?headEntity=${TemplateName}&entryEntity=${TemplateName}Entry',
				update: '../../scm/control/updateWithEntry?headEntity=${TemplateName}&entryEntity=${TemplateName}Entry'
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
