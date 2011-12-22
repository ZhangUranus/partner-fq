/**
 * @Purpose 树形model类
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.UserTreeModel', {
    extend : 'Ext.data.Model',
    alias:'UserTreeModel',
    fields : [
        {name: 'id',   type: 'string'},
        {name: 'text',   type: 'string'},
        {name: 'iconCls',   type: 'string'},
        {name: 'leaf',   type: 'boolean', defaultValue: true},
        {name: 'isUser',   type: 'boolean', defaultValue: true}
    ],
    
    proxy: {
        type: 'ajax',
        api: {
            read: '../../scm/control/getUserTreeToJson'
        },
        reader: {
            type: 'json',
            root: 'children',
            successProperty: 'success',
            messageProperty: 'message'
        },
        writer: {
            type: 'json',
            root: 'children',
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