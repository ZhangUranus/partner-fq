Ext.define('SCM.store.rpt.MaterialDetailQryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.MaterialDetailQryModel',
			alias : 'MaterialDetailQryStore',
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{
				property : 'NUMBER',
				direction : 'ASC'
			}]
		});