//
Ext.define('SCM.store.basedata.MaterialTypeStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.basedata.MaterialTypeModel',
    alias:'MaterialTypeStore',
    autoLoad: false,
    autoSync: true,

    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=TMaterialType',
            create: '../../scm/control/addnewJsonData?entity=TMaterialType',
            update: '../../scm/control/updateJsonData?entity=TMaterialType',
            destroy: '../../scm/control/deleteJsonData?entity=TMaterialType'
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