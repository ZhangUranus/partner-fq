Ext.define('SCM.store.${TemplateName}.${TemplateName}EditStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.${TemplateName}.${TemplateName}EditModel',
			alias : '${TemplateName}EditStore',
			autoLoad : false,
			autoSync : false
		});