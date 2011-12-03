/**
 * @Purpose 角色model
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.RoleModel', {
    extend: 'Ext.data.Model',
    alias: 'RoleModel',
    fields: [
    	{name: 'id',  type: 'string'},
        {name: 'userId',   type: 'string'},
        {name: 'roleId',   type: 'string'}
    ],
    belongsTo: 'SCM.model.system.UserModel',
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});