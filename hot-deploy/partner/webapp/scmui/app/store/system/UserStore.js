//
Ext.define('SCM.store.system.UserStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.system.UserModel',
    alias:'UserStore',
    autoLoad: false,
    autoSync: true,

    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=VSystemUser',
            create: '../../scm/control/addnewJsonData?entity=TSystemUser',
            update: '../../scm/control/updateJsonData?entity=TSystemUser',
            destroy: '../../scm/control/deleteJsonData?entity=TSystemUser'
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