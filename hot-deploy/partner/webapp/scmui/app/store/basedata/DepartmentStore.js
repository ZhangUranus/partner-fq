//
Ext.define('SCM.store.basedata.DepartmentStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.basedata.DepartmentModel',
    alias:'DepartmentStore',
    autoLoad: false,
    autoSync: true,

    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=Department',
            create: '../../scm/control/addnewJsonData?entity=Department',
            update: '../../scm/control/updateJsonData?entity=Department',
            destroy: '../../scm/control/deleteJsonData?entity=Department'
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