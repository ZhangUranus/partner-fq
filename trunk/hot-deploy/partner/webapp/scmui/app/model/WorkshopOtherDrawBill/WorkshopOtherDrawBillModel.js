// 定义数据模型
Ext.define('SCM.model.WorkshopOtherDrawBill.WorkshopOtherDrawBillModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'WorkshopOtherDrawBillModel',
			// 字段
			fields : [{
						name : 'id',
						type : 'string'
					}, {
						name : 'emptyId',
						type : 'string',
						persist : false
					}, {
						name : 'number',
						type : 'string'
					}, {
						name : 'bizDate',
						type : 'date',
						dateFormat : 'time'
					}
											 //\n
						 ,{name: 'workshopWorkshopId',type:'string'  }
						 ,{name: 'workshopWorkshopName',type:'string' ,persist:false }
						 											 //\n
						 ,{name: 'buyerSystemUserId',type:'string'  }
						 ,{name: 'buyerSystemUserName',type:'string' ,persist:false }
						 											 //\n
						 ,{name: 'submitterSystemUserId',type:'string'  }
						 ,{name: 'submitterSystemUserName',type:'string' ,persist:false }
						 											 //\n
						 ,{name: 'totalsum'  ,type:'float'  }
						 					 //\n
						 ,{name: 'entryId', type: 'string'}
											 //\n
						 ,{name: 'warehouseWarehouseId',type:'string'  }
						 ,{name: 'warehouseWarehouseName',type:'string' ,persist:false }
						 											 //\n
						 ,{name: 'materialMaterialId',type:'string'  }
						 ,{name: 'materialMaterialName',type:'string' ,persist:false }
						 , {name : 'materialMaterialModel',	type : 'string'	}
						 ,{name: 'volume'  ,type:'float'   }
						 											 //\n
						 ,{name: 'unitUnitId',type:'string'  }
						 ,{name: 'unitUnitName',type:'string' ,persist:false }
						 											 //\n
						 ,{name: 'price'  ,type:'float'   }
						 											 //\n
						 ,{name: 'refPrice'  ,type:'float'   }
						 											 //\n
						 ,{name: 'entrysum'  ,type:'float'   }
						 					 //\n
			],
			// ,idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=WorkshopOtherDrawBillView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=WorkshopOtherDrawBill&entryEntity=WorkshopOtherDrawBillEntry'
				},
				remoteFilter : true
			}
		});