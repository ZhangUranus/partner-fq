//定义数据模型
Ext.define('SCM.model.basedata.MaterialModel', {
    extend: 'Ext.data.Model',
    alias: 'MaterialModel',
    //字段
    fields: [
             {name: 'id',  type: 'string'},
             {name: 'number',   type: 'string'},
             {name: 'name', type: 'string'},
			 {name: 'model', type: 'string'},
		     {name: 'defaultPrice', type: 'float'},
			 {name: 'defaultSupplier', type: 'string'},
			 {name: 'safeStock', type: 'float'},
			 {name: 'defaultUnitId', type: 'string'},
			 {name: 'defaultUnitName', type: 'string',persist:false},
			 {name: 'materialTypeId', type: 'string'},
			 {name: 'materialTypeName', type: 'string',persist:false}
         ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});