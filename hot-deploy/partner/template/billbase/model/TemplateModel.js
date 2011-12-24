//定义数据模型
Ext.define('SCM.model.${TemplateName}.${TemplateName}Model', {
    extend: 'Ext.data.Model',
    alias: '${TemplateName}Model',
    //字段
    fields: [
			  {name: 'id',  type: 'string'}
			 ,{name: 'emptyId',type:'string', persist:false}
			 ,{name: 'number',type:'string'}
             ,{name: 'bizDate',type:'date',dateFormat:'time'}
		#foreach($headfield in $HeadFields)
			 #if($headfield.type!='entity')//\n
			 ,{name: '$headfield.name',type:'$headfield.type' #if($headfield.type=='date'),dateFormat:'time' #end #if($headfield.isPersis==false),persist:false #end}
			 #else//\n
			 ,{name: '${headfield.name}${headfield.entity}Id',type:'string'  #if($headfield.isPersis==false),persist:false #end}
			 ,{name: '${headfield.name}${headfield.entity}Name',type:'string' ,persist:false }
			 #end
		#end //\n
			 ,{name: 'entryId', type: 'string'}
    ],
	idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
});