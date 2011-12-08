//
Ext.define('SCM.store.basedata.MaterialTypeTreeStore', {
    extend: 'Ext.data.TreeStore',
    model: 'SCM.model.basedata.MaterialTypeTreeModel',
    alias:'MaterialTypeTreeStore',
    autoLoad: false,
    autoSync: false,
	root: {
            text: 'root',
            id: 'src',
            expanded: false//要设置为false，否则在每次新建该store的时候就向服务器request
    },

    proxy: {
        type: 'ajax',
		api: {
            read: '../../scm/control/requestTreeJsonData?entity=TMaterialType'     
		},
        reader: {
            type: 'json',
            root: 'children',//treeStore 需要使用children关键字
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