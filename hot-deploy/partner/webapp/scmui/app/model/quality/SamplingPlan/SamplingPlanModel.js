// 定义数据模型
Ext.define('SCM.model.quality.SamplingPlan.SamplingPlanModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'SamplingPlanModel',
			fields : [// 字段
			{
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'name',
						type : 'string'
					}, {
						name : 'creatorId',
						type : 'string'
					}, {
						name : 'creatorName',
						type : 'string',
						persist : false
					}, {
						name : 'lastUpdaterId',
						type : 'string'
					}, {
						name : 'lastUpdaterName',
						type : 'string',
						persist : false
					}, {
						name : 'normalSamplingFraction',
						type : 'float'
					}, {
						name : 'warningSamplingFraction',
						type : 'float'
					}, {
						name : 'complainSamplingFraction',
						type : 'float'
					}, {
						name : 'description',
						type : 'string'
					}, {
						name : 'createdStamp',
						defaultValue : new Date(),
						type : 'date',
						format : 'time',
						convert : function(value, record) {
							return new Date(value);
						},
						persist : false
					}, {
						name : 'lastUpdatedStamp',
						defaultValue : new Date(),
						type : 'date',
						format : 'time',
						convert : function(value, record) {
							return new Date(value);
						},
						persist : false
					}],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=SamplingPlanView',
					create : '../../scm/control/addnewJsonData?entity=SamplingPlan',
					update : '../../scm/control/updateJsonData?entity=SamplingPlan',
					destroy : '../../scm/control/deleteJsonData?entity=SamplingPlan'
				},
				extraParams : {
					queryField : 'number,name'
				}
			}
		});