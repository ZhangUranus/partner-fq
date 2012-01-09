//定义数据模型
Ext.define('SCM.model.PurchaseBill.PurchaseBillEditModel', {
    extend: 'Ext.data.Model',
    alias: 'PurchaseBillEditModel',
    //字段
    fields: [
              {name: 'id',  type: 'string'}
			 ,{name: 'number',  type: 'string'}
			 ,{name: 'bizDate',  type: 'date',defaultValue:new Date() ,
				convert: function(value, record) {
					return new Date(value);
				}
			  }
			 			 //\n
			 ,{name: 'myfield1' ,type:'string'  }
			 			 			 //\n
			 ,{name: 'myfield2' ,type:'date' ,dateFormat:'time',defaultValue:new Date(),convert: function(value, record) {return new Date(value);}  }
			 			 			 //\n
			 ,{name: 'myfield3' ,type:'boolean'  }
			 			 			 //\n
			 ,{name: 'myfield4UnitId',type:'string'  }
			 ,{name: 'myfield4UnitName',type:'string',persist:false }
			 			 			 //\n
			 ,{name: 'myfield5' ,type:'int'  }
			 			 			 //\n
			 ,{name: 'myField6',type:'string'   }
			 			 //\n
			 ,{name: 'createdStamp', defaultValue:new Date(), type: 'date',format:'time',convert: function(value, record) {return new Date(value);},persist:false}
			 ,{name: 'lastUpdatedStamp', defaultValue:new Date(), type: 'date',format:'time',convert: function(value, record) {return new Date(value);},persist:false}
			 ,{name: 'note',  type: 'string'}
			 ,{name: 'status',  type: 'int'}
    ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});