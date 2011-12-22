//
Ext.define('SCM.store.system.UserStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.system.UserModel',
    alias:'UserStore',
    autoLoad: true,
    autoSync: true
});