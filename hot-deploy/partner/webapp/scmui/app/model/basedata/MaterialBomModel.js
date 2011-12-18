//定义数据模型
Ext.define('SCM.model.basedata.MaterialBomModel', {
    extend: 'Ext.data.Model',
    alias: 'MaterialBomModel',
    //字段
    fields: [
			 {name: 'id',  type: 'string'},
			 {name: 'emptyId',type:'string'},
			 {name: 'number',type:'string'},
             {name: 'materialName',   type: 'string'},
             {name: 'bomMaterialNum', type: 'string'},
			 {name: 'bomMaterialModel', type: 'string'},
		     {name: 'volume', type: 'float'},
			 {name: 'unitName', type: 'string'}
    ],
	idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
});