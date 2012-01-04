//定义数据模型
Ext.define('SCM.model.PurchaseBill.PurchaseBillEditEntryModel', {
    extend: 'Ext.data.Model',
    alias: 'PurchaseBillEditEntryModel',
    //字段
    fields: [
             {name: 'id',  type: 'string'}
			 ,{name: 'parentId',  type: 'string'}
			 			 //\n
			 ,{name: 'myentryfield1' ,type:'string'  }
			 			 			 //\n
			 ,{name: 'myentryfield2' ,type:'date' ,dateFormat:'time',defaultValue:new Date(),convert: function(value, record) {return new Date(value);}  }
			 			 			 //\n
			 ,{name: 'myentryfield3' ,type:'boolean'  }
			 			 			 //\n
			 ,{name: 'myentryfield4UnitId',type:'string'  }
			 ,{name: 'myentryfield4UnitName',type:'string',persist:false }
			 			 			 //\n
			 ,{name: 'myentryfield5' ,type:'float'  }
			 			 			 //\n
			 ,{name: 'myentryfield6' ,type:'int'  }
			 			 			 //\n
			 ,{name: 'myentryfield7',type:'string'   }
			 			 //\n
    ],

    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});