Ext.define('SCM.store.basedata.DepartmentTreeStore', {
			extend : 'Ext.data.TreeStore',
			model : 'SCM.model.basedata.DepartmentTreeModel',
			alias : 'DepartmentTreeStore',
			autoLoad : false,
			autoSync : true
		});