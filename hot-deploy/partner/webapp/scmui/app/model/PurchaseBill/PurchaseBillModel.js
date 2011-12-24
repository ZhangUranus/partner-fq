//定义数据模型
Ext.define('SCM.model.PurchaseBill.PurchaseBillModel', {
    extend: 'Ext.data.Model',
    alias: 'PurchaseBillModel',
    //字段
    fields: [
			  {name: 'id',  type: 'string'}
			 ,{name: 'emptyId',type:'string', persis:false}
			 ,{name: 'number',type:'string'}
             ,{name: 'bizDate',type:'date',dateFormat:'time'}
					 ,{name: 'myfield1',type:'string'  }
					 ,{name: 'myfield2',type:'date' ,dateFormat:'time'  }
					 ,{name: 'myfield3',type:'boolean'  }
					 ,{name: 'entryId', type: 'string'}
    ],
	idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
});