//
Ext.define('SCM.store.basedata.UnitStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.basedata.UnitModel',
    alias:'UnitStore',
    autoLoad: true,
    autoSync: true,

    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=Unit',
            create: '../../scm/control/addnewJsonData?entity=Unit',
            update: '../../scm/control/updateJsonData?entity=Unit',
            destroy: '../../scm/control/deleteJsonData?entity=Unit'
        },
        reader: {
            type: 'json',
            root: 'records',
            successProperty: 'success'
        },
		writer: {
            type: 'json',
            root: 'records',
            encode: true //请求服务器时以param参数传进json数据
        },
        listeners: {
            exception: function(proxy, response, operation){
                Ext.MessageBox.show({
                    title: 'ERROR',
                    msg: operation.getError(),
                    icon: Ext.MessageBox.ERROR,
                    buttons: Ext.Msg.OK
                });
            }
    }

    }
});