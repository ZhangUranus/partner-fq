Ext.define('SCM.store.basedata.MaterialTypeTreeStore', {
			extend : 'Ext.data.TreeStore',
			model : 'SCM.model.basedata.MaterialTypeTreeModel',
			alias : 'MaterialTypeTreeStore',
			autoLoad : false,
			autoSync : true
		});