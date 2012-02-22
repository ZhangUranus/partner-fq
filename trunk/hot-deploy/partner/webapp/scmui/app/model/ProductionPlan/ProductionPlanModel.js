// 定义数据模型
Ext.define('SCM.model.ProductionPlan.ProductionPlanModel', {
			extend : 'Ext.data.Model',
			alias : 'ProductionPlanModel',
			requires : ['SCM.extend.proxy.JsonAjax'],
			fields : [// 字段
					{
						name : 'WAREHOUSENAME',
						type : 'string'
					}, {
						name : 'MATERIALNAME',
						type : 'string'
					}, {
						name : 'MATERIALMODEL',
						type : 'string'
					}, {
						name : 'UNITNAME',
						type : 'string'
					}, {
						name : 'VOLUME',
						type : 'float'
					}, {
						name : 'STOCKVOLUME',
						type : 'float'
					}, {
						name : 'ISOUT',
						convert:function(value,record){
							if(record.get('STOCKVOLUME')<record.get('VOLUME')){
								return true;//库存不足
							}else{
								return false;
							}
						}
					}, {
						name : 'PRICE',
						type : 'float'
					}, {
						name : 'ENDSUM',
						type : 'float'
					}],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/queryProductionPlan'
				}
			}
		});