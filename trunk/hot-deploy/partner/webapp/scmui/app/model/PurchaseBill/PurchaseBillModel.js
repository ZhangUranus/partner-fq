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
			 ,{name: 'myfield1',type:'string'  }
			 					 //\n
			 ,{name: 'myfield2',type:'date' ,dateFormat:'time'  }
			 					 //\n
			 ,{name: 'myfield3',type:'boolean'  }
			 					 //\n
			 ,{name: 'myfield4UnitId',type:'string'  }
			 ,{name: 'myfield4UnitName',type:'string' ,persist:false }
			 					 //\n
			 ,{name: 'myfield5',type:'int'  }
			 		 //\n
			 ,{name: 'entryId', type: 'string'}
					 //\n
			 ,{name: 'myentryfield1',type:'string'  }
			 					 //\n
			 ,{name: 'myentryfield2',type:'date' ,dateFormat:'time'  }
			 					 //\n
			 ,{name: 'myentryfield3',type:'boolean'  }
			 					 //\n
			 ,{name: 'myentryfield4UnitId',type:'string'  }
			 ,{name: 'myentryfield4UnitName',type:'string' ,persist:false }
			 					 //\n
			 ,{name: 'myentryfield5',type:'float'  }
			 					 //\n
			 ,{name: 'myentryfield6',type:'int'  }
			 		 //\n

    ],
	idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
});