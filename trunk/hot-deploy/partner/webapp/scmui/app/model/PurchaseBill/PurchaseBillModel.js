//定义数据模型
Ext.define('SCM.model.PurchaseBill.PurchaseBillModel', {
    extend: 'Ext.data.Model',
    alias: 'PurchaseBillModel',
    //字段
    fields: [
			  {name: 'id',  type: 'string'}
			 ,{name: 'emptyId',type:'string', persist:false}
			 ,{name: 'number',type:'string'}
             ,{name: 'bizDate',type:'date',dateFormat:'time'}
					 //\n
			 ,{name: 'supplierSupplierId',type:'string'  }
			 ,{name: 'supplierSupplierName',type:'string' ,persist:false }
			 					 //\n
			 ,{name: 'purchserTSystemUserId',type:'string'  }
			 ,{name: 'purchserTSystemUserName',type:'string' ,persist:false }
			 					 //\n
			 ,{name: 'auditerTSystemUserId',type:'string'  }
			 ,{name: 'auditerTSystemUserName',type:'string' ,persist:false }
			 					 //\n
			 ,{name: 'totolAccount'  ,type:'float'  }
			 		 //\n
			 ,{name: 'entryId', type: 'string'}
					 //\n
			 ,{name: 'materialMaterialId',type:'string'  }
			 ,{name: 'materialMaterialName',type:'string' ,persist:false }
			 					 //\n
			 ,{name: 'amount'  ,type:'float'   }
			 					 //\n
			 ,{name: 'unitUnitId',type:'string'  }
			 ,{name: 'unitUnitName',type:'string' ,persist:false }
			 					 //\n
			 ,{name: 'price'  ,type:'float'   }
			 					 //\n
			 ,{name: 'refPrice'  ,type:'float'   }
			 					 //\n
			 ,{name: 'account'  ,type:'float'   }
			 		 //\n

    ]
    //,idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
});