Ext.define('SCM.store.system.UserTreeStore', {
    extend: 'Ext.data.TreeStore',
    model : 'SCM.model.system.UserTreeModel',
    alias:'UserTreeStore',
    autoLoad: false,
    autoSync: true
});