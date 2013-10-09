Ext.define('SCM.store.ProductionPlan.ProductionPlanStore', {
			extend : 'Ext.data.Store',
			model : 'SCM.model.ProductionPlan.ProductionPlanModel',
			alias : 'ProductionPlanStore',
			pageSize : SCM.unpageSize, // 每页行数
			remoteSort : true, // 服务器排序
			autoLoad : false,
			autoSync : false,
			sorters : [{// 根据WAREHOUSENAME字段排序
				property : 'MATERIALNAME',
				direction : 'ASC'
			}]
		});