//定义数据模型
Ext.define('SCM.model.${TemplateName}.${TemplateName}EditModel', {
    extend: 'Ext.data.Model',
    alias: '${TemplateName}EditModel',
    //字段
    fields: [
              {name: 'id',  type: 'string'}
			 ,{name: 'number',  type: 'string'}
			 ,{name: 'name',  type: 'string'}
			 #foreach($headfield in $HeadFields)
			 #if($headfield.type!='entity')//\n
			 ,{name: '${headfield.name}'#if($headfield.type=='enum'),type:'string' #else ,type:'$headfield.type'#end #if($headfield.type=='date'),dateFormat:'time',defaultValue:new Date(),convert: function(value, record) {return new Date(value);} #end #if($headfield.isPersis==false),persist:false #end}
			 #else//\n
			 ,{name: '${headfield.name}${headfield.entity}Id',type:'string'  #if($headfield.isPersis==false),persist:false #end}
			 ,{name: '${headfield.name}${headfield.entity}Name',type:'string',persist:false }
			 #end
			 #end//\n
			 ,{name: 'createdStamp', defaultValue:new Date(), type: 'date',format:'time',convert: function(value, record) {return new Date(value);},persist:false}
			 ,{name: 'lastUpdatedStamp', defaultValue:new Date(), type: 'date',format:'time',convert: function(value, record) {return new Date(value);},persist:false}
			 
    ],
    requires: ['Ext.data.UuidGenerator'],
    idgen: 'uuid' //使用uuid生成记录id 每个模型必须要有id字段
});