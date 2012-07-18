Ext.define('SCM.store.ConsignWarehousing.ConsignWarehousingEntryDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ConsignWarehousing.ConsignWarehousingEntryDetailModel',
			alias : 'ConsignWarehousingEntryDetailStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialMaterialId',
				direction : 'ASC'
			}]
		});