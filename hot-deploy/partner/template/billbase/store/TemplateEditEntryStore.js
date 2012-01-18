Ext.define('SCM.store.${TemplateName}.${TemplateName}EditEntryStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.${TemplateName}.${TemplateName}EditEntryModel',
    alias:'${TemplateName}EditEntryStore',
    autoLoad: false,
    autoSync: false
});