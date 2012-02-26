Ext.define('SCM.store.system.UserOfRoleStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.system.UserOfRoleModel',
    alias:'UserOfRoleStore',
    autoLoad: false,
    autoSync: true
});