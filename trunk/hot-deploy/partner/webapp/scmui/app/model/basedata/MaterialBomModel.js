//定义数据模型
Ext.define('SCM.model.basedata.MaterialBomModel', {
    extend: 'Ext.data.Model',
    alias: 'MaterialBomModel',
    //字段
    fields: [
             {name: 'id',  type: 'string'},
             {name: 'materialName',   type: 'string'},
             {name: 'bomMaterialNum', type: 'string'},
			 {name: 'bomMaterialModel', type: 'string'},
		     {name: 'volume', type: 'float'},
			 {name: 'unitName', type: 'string'}
    ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});