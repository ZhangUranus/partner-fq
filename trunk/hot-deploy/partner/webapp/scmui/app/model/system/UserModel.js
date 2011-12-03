/**
 * @Purpose 用户树形model类
 * @author jeff-liu
 * @Date 2011-11-26
 */
Ext.define('SCM.model.system.UserModel', {
    extend: 'Ext.data.Model',
    requires: ['SCM.model.system.RoleModel', 'Ext.data.HasManyAssociation', 'Ext.data.BelongsToAssociation','Ext.data.UuidGenerator'],
    alias: 'UserModel',
    fields: [
    	{name: 'id',  type: 'string'},
        {name: 'userId',   type: 'string'},
        {name: 'userName',   type: 'string'},
        {name: 'userEname', type: 'string', defaultValue: ''},
        {name: 'password', type: 'string', defaultValue: ''},
        {name: 'sex', type: 'string', defaultValue: '0'},
        {name: 'departmentName', type: 'string', defaultValue: ''},
        {name: 'departmentId', type: 'string', defaultValue: ''},
        {name: 'position', type: 'string', defaultValue: ''},
        {name: 'phoneNumber', type: 'string', defaultValue: ''},
        {name: 'email', type: 'string', defaultValue: ''},
        {name: 'valid', type: 'string', defaultValue: 'Y'}
    ],
    hasMany: {model: 'SCM.model.system.RoleModel', name: 'roleModel'},
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});