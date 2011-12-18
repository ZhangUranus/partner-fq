//定义数据模型
Ext.define('SCM.model.basedata.MaterialBomEditModel', {
    extend: 'Ext.data.Model',
    alias: 'MaterialBomEditModel',
    //字段
    fields: [
             {name: 'id',  type: 'string'},
			 {name: 'number',  type: 'string'},
             {name: 'materialId',   type: 'string'},
             {name: 'materialName', type: 'string',persist:false}
			 
    ],

    hasMany : {  
        model : 'MaterialBomEditEntryModel',  
        name : 'entryList',  
        foreignKey : 'parentId',  
        associationKey : 'entryList' 
    },
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});