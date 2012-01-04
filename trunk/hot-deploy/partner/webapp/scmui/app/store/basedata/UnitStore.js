Ext.define('SCM.store.basedata.UnitStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.basedata.UnitModel',
    alias:'UnitStore',
    pageSize : 20,			//每页行数
    remoteSort: true,		//服务器排序
    autoLoad: false,
    autoSync: true
});