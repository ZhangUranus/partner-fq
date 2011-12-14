//
Ext.define('SCM.store.basedata.MaterialBomEditEntryStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.basedata.MaterialBomEditEntryModel',
    alias:'MaterialBomEditEntryStore',
    autoLoad: false,
    autoSync: false,

    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=MaterialBomEntryView'
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