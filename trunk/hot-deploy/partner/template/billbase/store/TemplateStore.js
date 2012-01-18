Ext.define('SCM.store.${TemplateName}.${TemplateName}Store', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.${TemplateName}.${TemplateName}Model',
    alias:'${TemplateName}Store',
    autoLoad: false,
    autoSync: false,
	groupField: 'number'
});