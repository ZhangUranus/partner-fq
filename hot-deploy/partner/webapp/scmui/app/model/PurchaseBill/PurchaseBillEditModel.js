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
			 ,{name: 'myfield1',type:'string'  }
			 //\n
			 ,{name: 'myfield2',type:'date' ,defaultValue:new Date(),convert: function(value, record) {return new Date(value);}  }
			 //\n
			 ,{name: 'myfield3',type:'boolean'  }
			  //\n
			 ,{name: 'note',  type: 'string'}
    ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});