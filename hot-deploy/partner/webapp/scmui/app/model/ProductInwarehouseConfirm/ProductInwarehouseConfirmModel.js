// 定义数据模型,进仓确认单
Ext.define('SCM.model.ProductInwarehouseConfirm.ProductInwarehouseConfirmModel', {
			extend : 'Ext.data.Model',
			requires : ['SCM.extend.proxy.JsonAjax'],
			alias : 'ProductInwarehouseConfirmModel',
			// 字段
			fields : [{
						name : 'id',
						type : 'string'
					},{
						name : 'number',
						type : 'string'
					}, {
						name : 'bizDate',
						type : 'date',
						dateFormat : 'time'
					} ,{name: 'productWeek',type:'string'  }
						 ,{name: 'submitterSystemUserId',type:'string'  }
						 ,{name: 'submitterSystemUserName',type:'string' ,persist:false }
						 										
						 ,{name: 'workshopWorkshopId',type:'string'  }
						 ,{name: 'workshopWorkshopName',type:'string' ,persist:false }
						 											 
						 ,{name: 'warehouseWarehouseId',type:'string'  }
						 ,{name: 'warehouseWarehouseName',type:'string' ,persist:false }
						 											
						 ,{name: 'materialMaterialId',type:'string'  }
						 ,{name: 'materialMaterialName',type:'string' ,persist:false }
						 											
						 ,{name: 'volume'  ,type:'float'   }
						 										
						 ,{name: 'unitUnitId',type:'string'  }
						 ,{name: 'unitUnitName',type:'string' ,persist:false }
						 										
						 ,{name: 'price'  ,type:'float'   }
						 										
						 ,{name: 'totalsum'  ,type:'float'   }
						 										
						 ,{name: 'barcode1'  ,type:'string'   }
						 										
						 ,{name: 'barcode2'  ,type:'string'   }
						 										
						 ,{name: 'inwarehouseType' ,type:'string'    }
						 
						 ,{name: 'status' ,type:'int'   }
			],
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=ProductInwarehouseConfirmView',
					destroy : '../../scm/control/deleteWithEntry?headEntity=ProductInwarehouseConfirm&entryEntity=ProductInwarehouseConfirmDetail'
				},
				remoteFilter : true
			}
		});