//
Ext.define('SCM.store.Supplier.SupplierStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.Supplier.SupplierModel',
    alias:'SupplierStore',
    autoLoad: true,
    autoSync: false,
	groupField: 'number',
    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=SupplierView',
			destroy:'../../scm/control/deleteWithEntry?headEntity=Supplier&entryEntity=SupplierEntry'
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