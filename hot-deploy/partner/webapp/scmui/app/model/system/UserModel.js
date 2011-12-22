/**
 * @Purpose 用户树形model类
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.UserModel', {
    extend: 'Ext.data.Model',
    alias: 'widget.userModel',
    fields: [
    	{name: 'id',  type: 'string'},
        {name: 'userId',   type: 'string'},
        {name: 'userName',   type: 'string'},
        {name: 'password', type: 'string', defaultValue: ''},
        {name: 'passwordComfirm', mapping: 'password' ,type: 'string', defaultValue: ''},
        {name: 'sex', type: 'string', defaultValue: '0'},
        {name: 'departmentId', type: 'string', defaultValue: ''},
        {name: 'position', type: 'string', defaultValue: ''},
        {name: 'phoneNumber', type: 'string', defaultValue: ''},
        {name: 'email', type: 'string', defaultValue: ''},
        {name: 'valid', type: 'string', defaultValue: 'Y'}
    ],
    proxy: {
        type: 'ajax',
        api: {
            read: '../../scm/control/requestRecordJson?entity=TSystemUser',
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
    },
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});