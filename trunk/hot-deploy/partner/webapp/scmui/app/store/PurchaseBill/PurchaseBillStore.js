Ext.define('SCM.store.PurchaseBill.PurchaseBillStore', {
    extend: 'Ext.data.Store',
    model: 'SCM.model.PurchaseBill.PurchaseBillModel',
    alias:'PurchaseBillStore',
    autoLoad: false,
    autoSync: false,
	groupField: 'number'
});