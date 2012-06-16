// 定义数据模型
Ext.define('SCM.model.WorkshopOtherDrawBill.WorkshopOtherDrawBillEditModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : 'WorkshopOtherDrawBillEditModel',
			// 字段
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'bizDate',
						type : 'date',
						defaultValue : new Date(),
						convert : function(value, record) {
							return new Date(value);
						}
					}
										//\n
					,{name: 'workshopWorkshopId',type:'string'  }
					,{name: 'workshopWorkshopName',type:'string',persist:false }
															//\n
					,{name: 'buyerSystemUserId',type:'string'  }
					,{name: 'buyerSystemUserName',type:'string',persist:false }
															//\n
					,{name: 'submitterSystemUserId',type:'string'  }
					,{name: 'submitterSystemUserName',type:'string',persist:false }
															//\n
					,{name: 'totalsum' ,type:'float'  }
										//\n
					,{name: 'createdStamp', defaultValue:new Date(), type: 'date',format:'time',convert: function(value, record) {return new Date(value);},persist:false}
					,{name: 'lastUpdatedStamp', defaultValue:new Date(), type: 'date',format:'time',convert: function(value, record) {return new Date(value);},persist:false}
					,{name: 'note',  type: 'string'}
					,{name: 'status',  type: 'int'}

			],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=WorkshopOtherDrawBillView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=WorkshopOtherDrawBill&entryEntity=WorkshopOtherDrawBillEntry'
				},
				remoteFilter : true
			}
		});