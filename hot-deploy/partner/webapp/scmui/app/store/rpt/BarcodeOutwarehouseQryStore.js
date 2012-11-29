Ext.define('SCM.store.rpt.BarcodeOutwarehouseQryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.BarcodeOutwarehouseQryModel',
			alias : 'BarcodeOutwarehouseQryStore',
//			pageSize : SCM.halfPageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{
				property : 'DELIVERY_NUMBER',
				direction : 'ASC'
			}]
		});