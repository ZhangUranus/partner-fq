//
Ext.define('SCM.store.Supplier.SupplierEditStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.Supplier.SupplierEditModel',
    alias:'SupplierEditStore',
    pageSize : 20,			//每页行数
    remoteSort: true,		//服务器排序
    autoLoad: false,
    autoSync: true,
	
    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=SupplierView',
            create: '../../scm/control/addnewJsonData?entity=Supplier',
            update: '../../scm/control/updateJsonData?entity=Supplier',
            destroy: '../../scm/control/deleteJsonData?entity=Supplier'
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