// 定义数据模型
Ext.define('SCM.model.${TemplateName}.${TemplateName}EditEntryModel', {
			extend : 'Ext.data.Model',
			requires : ['Ext.data.UuidGenerator', 'SCM.extend.proxy.JsonAjax'],
			alias : '${TemplateName}EditEntryModel',
			// 字段
			fields: [
	             {name: 'id',  type: 'string'}
				 ,{name: 'parentId',  type: 'string'}
				 #foreach($entryfield in $EntryFields)
				 #if($entryfield.type!='entity')// \n
				 ,{name: '${entryfield.name}'#if($entryfield.type=='enum'),type:'string' #else ,type:'$entryfield.type'#end #if(${entryfield.type}=='date'),dateFormat:'time',defaultValue:new Date(),convert: function(value, record) {return new Date(value);} #end #if(${entryfield.isPersis}==false),persist:false #end}
				 #else// \n
				 ,{name: '${entryfield.name}${entryfield.entity}Id',type:'string'  #if(${entryfield.isPersis}==false),persist:false #end}
				 ,{name: '${entryfield.name}${entryfield.entity}Name',type:'string',persist:false }
				 #end
				 #end// \n
			],
			idgen : 'uuid', // 使用uuid生成记录id 每个模型必须要有id字段
			proxy : {
				type : 'jsonajax',
				api : {
					read : '../../scm/control/requestJsonData?entity=${TemplateName}EntryView'
				},
				remoteFilter : true
			}
		});