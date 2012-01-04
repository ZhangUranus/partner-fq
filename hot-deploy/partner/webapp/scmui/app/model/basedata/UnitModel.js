//定义计量单位数据模型
Ext.define('SCM.model.basedata.UnitModel', {
    extend: 'Ext.data.Model',
    alias: 'UnitModel',
    fields: [//字段
             {name: 'id',  type: 'string'},
             {name: 'number',   type: 'string'},
             {name: 'name', type: 'string'}
         ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid', //使用uuid生成记录id 每个模型必须要有id字段
    proxy: {
        type: 'jsonajax',
		api: {
            read: '../../scm/control/requestJsonData?entity=Unit',
            create: '../../scm/control/addnewJsonData?entity=Unit',
            update: '../../scm/control/updateJsonData?entity=Unit',
            destroy: '../../scm/control/deleteJsonData?entity=Unit'
        }
    }
});