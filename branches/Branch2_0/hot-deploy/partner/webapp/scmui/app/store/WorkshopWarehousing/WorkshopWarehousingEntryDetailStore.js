Ext.define('SCM.store.WorkshopWarehousing.WorkshopWarehousingEntryDetailStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.WorkshopWarehousing.WorkshopWarehousingEntryDetailModel',
			alias : 'WorkshopWarehousingEntryDetailStore',
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据materialMaterialId字段排序
				property : 'materialMaterialId',
				direction : 'ASC'
			}]
		});