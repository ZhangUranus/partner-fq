//定义数据模型
Ext.define('SCM.model.basedata.CustomerModel', {
    extend: 'Ext.data.Model',
    alias: 'CustomerModel',
    //字段
    fields: [
             {name: 'id',  type: 'string'},
             {name: 'number',   type: 'string'},
             {name: 'name', type: 'string'},
             {name: 'address', type: 'string'},
             {name: 'contact', type: 'string'},
             {name: 'phone', type: 'string'},
             {name: 'fax', type: 'string'},
             {name: 'postCode', type: 'string'}
         ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});