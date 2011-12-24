//定义数据模型
Ext.define('SCM.model.${TemplateName}.${TemplateName}EditModel', {
    extend: 'Ext.data.Model',
    alias: '${TemplateName}EditModel',
    //字段
    fields: [
              {name: 'id',  type: 'string'}
			 ,{name: 'number',  type: 'string'}
			 ,{name: 'bizDate',  type: 'date',defaultValue:new Date() ,
				convert: function(value, record) {
					return new Date(value);
				}
			  }
			 #foreach($headfield in $HeadFields)//\n
			 ,{name: '$headfield.name',type:'$headfield.type' #if($headfield.type=='date'),defaultValue:new Date(),convert: function(value, record) {return new Date(value);} #end #if($headfield.isPersis==false),persis:false #end}
			 #end //\n
			 ,{name: 'note',  type: 'string'}
    ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});