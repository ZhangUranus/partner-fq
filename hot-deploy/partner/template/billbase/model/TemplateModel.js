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
			 ,{name: '$headfield.name' #if($headfield.type=='enum'),type:'string' #else ,type:'$headfield.type'#end #if($headfield.type=='date'),dateFormat:'time' #end #if($headfield.isPersis==false),persist:false #end}
			 #else//\n
			 ,{name: '${headfield.name}${headfield.entity}Id',type:'string'  #if($headfield.isPersis==false),persist:false #end}
			 ,{name: '${headfield.name}${headfield.entity}Name',type:'string' ,persist:false }
			 #end
		#end //\n
			 ,{name: 'entryId', type: 'string'}
		#foreach($entryfield in $EntryFields)
			 #if($entryfield.type!='entity')//\n
			 ,{name: '${entryfield.name}' #if($entryfield.type=='enum'),type:'string' #else ,type:'$entryfield.type'#end  #if($entryfield.type=='date'),dateFormat:'time' #end #if($entryfield.isPersis==false),persist:false #end}
			 #else//\n
			 ,{name: '${entryfield.name}${entryfield.entity}Id',type:'string'  #if($entryfield.isPersis==false),persist:false #end}
			 ,{name: '${entryfield.name}${entryfield.entity}Name',type:'string' ,persist:false }
			 #end
		#end //\n

    ],
	idProperty:'emptyId'//设置一个没用的id，这样才能支持显示多分录
});