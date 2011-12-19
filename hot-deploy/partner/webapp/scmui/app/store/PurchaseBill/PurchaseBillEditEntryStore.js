//
Ext.define('SCM.store.PurchaseBill.PurchaseBillEditEntryStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.PurchaseBill.PurchaseBillEditEntryModel',
    alias:'PurchaseBillEditEntryStore',
    autoLoad: false,
    autoSync: false,

    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=PurchaseBillEntryView'
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