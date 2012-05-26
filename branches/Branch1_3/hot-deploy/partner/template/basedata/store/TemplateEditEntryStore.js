//
Ext.define('SCM.store.${TemplateName}.${TemplateName}EditEntryStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.${TemplateName}.${TemplateName}EditEntryModel',
    alias:'${TemplateName}EditEntryStore',
    autoLoad: false,
    autoSync: false,

    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=${TemplateName}EntryView'
        },
        reader: {
            type: 'json',
            root: 'records',
            successProperty: 'success',
            messageProperty: 'message'
        },
		remoteFilter:true,
        listeners: {
            exception: function(proxy, response, operation){
                Ext.MessageBox.show({
                    title: '服务器端异常',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
    }

    }
});