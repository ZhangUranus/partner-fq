Ext.define('SCM.store.rpt.BarcodeInwarehouseQryStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.rpt.BarcodeInwarehouseQryModel',
			alias : 'BarcodeInwarehouseQryStore',
//			pageSize : SCM.halfPageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{
				property : 'IKEA_NUMBER',
				direction : 'ASC'
			}]
		});