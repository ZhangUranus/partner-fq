//
Ext.define('SCM.store.basedata.WarehouseTypeStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.basedata.WarehouseTypeModel',
    alias:'WarehouseTypeStore',
    autoLoad: true,
    autoSync: true,

    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=WarehouseType',
            create: '../../scm/control/addnewJsonData?entity=WarehouseType',
            update: '../../scm/control/updateJsonData?entity=WarehouseType',
            destroy: '../../scm/control/deleteJsonData?entity=WarehouseType'
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