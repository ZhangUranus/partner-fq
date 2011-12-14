//定义数据模型
Ext.define('SCM.model.basedata.MaterialBomEditEntryModel', {
    extend: 'Ext.data.Model',
    alias: 'MaterialBomEditEntryModel',
    //字段
    fields: [
             {name: 'id',  type: 'string'},
			 {name: 'parentId',  type: 'string'},
             {name: 'entryMaterialId',   type: 'string'},
             {name: 'entryMaterialName', type: 'string',persist:false},
			 {name: 'volume', type: 'float'},
		     {name: 'entryUnitId',   type: 'string'},
             {name: 'entryUnitName', type: 'string',persist:false}
    ],

    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});