//
Ext.define('SCM.store.basedata.CustomerStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.basedata.CustomerModel',
    alias:'CustomerStore',
    autoLoad: false,
    autoSync: true,

    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=Customer',
            create: '../../scm/control/addnewJsonData?entity=Customer',
            update: '../../scm/control/updateJsonData?entity=Customer',
            destroy: '../../scm/control/deleteJsonData?entity=Customer'
        },
        reader: {
            type: 'json',
            root: 'records',
            successProperty: 'success',
            messageProperty: 'message'
        },
		writer: {
            type: 'json',
            root: 'records',
            encode: true //请求服务器时以param参数传进json数据
        },
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