//定义数据模型
Ext.define('SCM.model.Supplier.SupplierEditModel', {
    extend: 'Ext.data.Model',
    alias: 'SupplierEditModel',
    //字段
    fields: [
              {name: 'id',  type: 'string'}
			 ,{name: 'number',  type: 'string'}
			 ,{name: 'name',  type: 'string'}
			 			 //\n
			 ,{name: 'phoneNum' ,type:'string'  }
			 			 			 //\n
			 ,{name: 'address' ,type:'string'  }
			 			 //\n
			 ,{name: 'createdStamp', defaultValue:new Date(), type: 'date',format:'time',convert: function(value, record) {return new Date(value);},persist:false}
			 ,{name: 'lastUpdatedStamp', defaultValue:new Date(), type: 'date',format:'time',convert: function(value, record) {return new Date(value);},persist:false}
			 
    ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});