//表头，单分录模型
Ext.define('SCM.model.${TemplateName}.${TemplateName}ActionModel', {
    extend: 'Ext.data.Model',
    requires: ['SCM.extend.proxy.JsonAjax'],
    alias: '${TemplateName}ActionModel',
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
			create: '../../scm/control/createWithEntry?headEntity=${TemplateName}&entryEntity=${TemplateName}Entry',
			update: '../../scm/control/updateWithEntry?headEntity=${TemplateName}&entryEntity=${TemplateName}Entry'
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
