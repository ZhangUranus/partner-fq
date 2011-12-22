/**
 * @Purpose 角色model
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.UserOfRoleModel', {
    extend: 'Ext.data.Model',
    alias: 'UserOfRoleModel',
    fields: [
        {name: 'id',  type: 'string'},
        {name: 'userId',   type: 'string'},
        {name: 'roleId',   type: 'string'}
    ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid', //使用uuid生成记录id 每个模型必须要有id字段
    proxy: {
        type: 'ajax',
        api: {
            read: '../../scm/control/requestJsonData?entity=TSystemUserOfRole',
            create: '../../scm/control/addnewJsonData?entity=TSystemUserOfRole',
            update: '../../scm/control/updateJsonData?entity=TSystemUserOfRole',
            destroy: '../../scm/control/deleteJsonData?entity=TSystemUserOfRole'
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