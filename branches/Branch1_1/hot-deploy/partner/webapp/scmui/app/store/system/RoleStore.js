Ext.define('SCM.store.system.RoleStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.system.RoleModel',
    alias:'RoleStore',
    autoLoad: false,
    autoSync: true
});