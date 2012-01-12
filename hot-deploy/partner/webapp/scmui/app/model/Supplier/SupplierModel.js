//定义数据模型
Ext.define('SCM.model.Supplier.SupplierModel', {
    extend: 'Ext.data.Model',
    alias: 'SupplierModel',
    //字段
    fields: [
			  {name: 'id',  type: 'string'}
			 ,{name: 'number',  type: 'string'}
			 ,{name: 'name',  type: 'string'}
					 //\n
			 ,{name: 'phoneNum'  ,type:'string'  }
			 					 //\n
			 ,{name: 'address'  ,type:'string'  }
			 		 //\n
			 ,{name: 'entryId', type: 'string'}
		 //\n

    ]
    //,idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
});