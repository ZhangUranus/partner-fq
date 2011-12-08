//定义数据模型
Ext.define('SCM.model.basedata.MaterialTreeModel', {
    extend: 'Ext.data.Model',
    alias: 'MaterialTreeModel',
    //字段
    fields: [
             {name: 'id',  type: 'string'},
			 {name: 'parentId',  type: 'string'},
             {name: 'number',   type: 'string'},
             {name: 'name', type: 'string'}
         ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});