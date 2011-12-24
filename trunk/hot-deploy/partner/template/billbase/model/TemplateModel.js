//定义数据模型
Ext.define('SCM.model.${TemplateName}.${TemplateName}Model', {
    extend: 'Ext.data.Model',
    alias: '${TemplateName}Model',
    //字段
    fields: [
			  {name: 'id',  type: 'string'}
			 ,{name: 'emptyId',type:'string', persis:false}
			 ,{name: 'number',type:'string'}
             ,{name: 'bizDate',type:'date',dateFormat:'time'}
		#foreach($headfield in $HeadFields)
			 ,{name: '$headfield.name',type:'$headfield.type' #if($headfield.type=='date'),dateFormat:'time' #end #if($headfield.isPersis==false),persis:false #end}
		#end 
			 ,{name: 'entryId', type: 'string'}
    ],
	idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
});