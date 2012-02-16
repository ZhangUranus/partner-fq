Ext.define('SCM.view.${TemplateName}.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.${TemplateName}edit',

    width: 290,
    title : '${TemplateAlias}编辑',
    layout: 'fit',
    autoShow: false,
    modal:true,//背景变灰，不能编辑
    inited : false, //初始化标识
	modifyed : false, //修改标识
    uiStatus:'AddNew',
    
	requires: ['SCM.ux.SelectorField'],

    initComponent: function() {
		this.initForm();
		this.initToolbar();
        this.callParent(arguments);
    },
    close : function() {
				this.hide();
				this.inited = false;
				this.modifyed = false;
	},
	//初始化表单
	initForm: function(){
		this.items = [{
							xtype : 'form',
							bodyPadding : 5,
							items : [{
										xtype : 'textfield',
										name : 'id',
										fieldLabel : 'id',
										hidden : true
									}, {
										xtype : 'textfield',
										name : 'number',
										fieldLabel : '编码',
										margin: 5,
										hidden : true
									}, {
										xtype : 'textfield',
										name : 'name',
										fieldLabel : '名称',
										margin: 5,
										allowBlank : false,
										maxLength : 50
									}
									#foreach($headfield in $HeadFields)
								#if($headfield.isHidden==false&&$headfield.type!='entity')//\n
								,{
								  #if($headfield.type=='string')//\n
								  xtype: 'textfield'
								  ,fieldLabel: '$headfield.alias'
								  #end
								  #if($headfield.type=='int')//\n
								  xtype: 'numberfield'
								  ,allowDecimals:false
								  ,hideTrigger:true
								  ,fieldLabel: '$headfield.alias'
								  #end
								  #if($headfield.type=='float')//\n
								  xtype: 'numberfield'
								  ,hideTrigger:true
								  ,fieldLabel: '$headfield.alias'
								  #end
								  #if($headfield.type=='boolean')//\n
								  xtype: 'checkboxfield'
								  ,uncheckedValue:false
								  ,inputValue:true
								  ,boxLabel:'$headfield.alias'
								  #end
								  #if($headfield.type=='date')//\n
								  xtype: 'datefield'
								  ,format:'Y-m-d'
								  ,fieldLabel: '$headfield.alias'
								  #end//\n
								   #if($headfield.type=='enum')//\n
								  xtype: 'combobox'
								  ,fieldLabel: '$headfield.alias'
								  ,store:$headfield.enumStore
								  ,displayField:'name'
								  ,valueField:'id'
								  #end//\n
								  ,name : '$headfield.name'
								  ,margin: 5
								  
								}
								#elseif($headfield.isHidden==false&&$headfield.type=='entity')//\n
								,{
								  xtype: 'selectorfield',
								  storeName:'${headfield.entity}Store',//定义数据集名称
								  parentFormName:'${TemplateName}form',
								  name : '${headfield.name}${headfield.entity}Id',
								  margin: 5,
								  fieldLabel: '${headfield.alias}'
								}
								#end 
								#end //\n
								]
						}];
    },
    
    //初始化工具栏
    initToolbar:function(){
    	this.dockedItems=[
	    	{xtype:'toolbar',
	    	items:[{xtye:'button',text:'保存',cls:'x-btn-text-icon',icon:'/scmui/images/icons/save.png',action:'save'}
	    			,{xtye:'button',text:'打印',cls:'x-btn-text-icon',icon:'/scmui/images/icons/printer.gif',action:'print'}]
	    	}
    	];
    }

});