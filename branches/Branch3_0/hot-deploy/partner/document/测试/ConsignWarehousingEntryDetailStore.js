Ext.define('SCM.store.ConsignWarehousing.ConsignWarehousingEntryDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignWarehousing.ConsignWarehousingEntryDetailModel',
			alias : 'ConsignWarehousingEntryDetailStore',
			pageSize : SCM.unpageSize, // 每页行数
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialMaterialId',
				direction : 'ASC'
			}]
		});