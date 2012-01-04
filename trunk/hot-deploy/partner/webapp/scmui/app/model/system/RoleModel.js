/**
 * @Purpose 角色model
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.RoleModel', {
    extend: 'Ext.data.Model',
    alias: 'RoleModel',
    fields: [
        {name: 'roleId',   type: 'string'},
        {name: 'roleName',   type: 'string'}
    ],
    idProperty : 'roleId',
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid', //使用uuid生成记录id 每个模型必须要有id字段
    proxy: {
        type: 'jsonajax',
        api: {
            read: '../../scm/control/requestJsonData?entity=TSystemRole'
        }
    }
});