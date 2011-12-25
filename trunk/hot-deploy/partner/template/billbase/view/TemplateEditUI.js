Ext.define('SCM.view.${TemplateName}.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.${TemplateName}edit',

	height: 550,
	width: 815,
    title : '${TemplateName}',
    layout: 'fit',
    autoShow: true,
    modal:true,//背景变灰，不能编辑
    uiStatus:'AddNew',
    
	requires: ['SCM.ux.SelectorField','Ext.ux.CheckColumn'],

    initComponent: function() {
		this.initForm();
		this.initToolbar();
        this.callParent(arguments);
    },
    
	//初始化表单
	initForm: function(){
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		var entryStore=Ext.create('${TemplateName}EditEntryStore');
    	this.items = [
					  {
						  xtype: 'form',
						  name:'${TemplateName}form',
						  bodyPadding:5,
						  layout:'border',
						  items: [
						{
							xtype: 'container',
							height: 200,
							layout: {
								columns: 3,
								type: 'table'
							},
							region: 'north',
							items: [
								
								 {
								  xtype: 'textfield',
								  name : 'number',
								  margin: 5,
								  fieldLabel: '编码'
								 }
								,{
								  xtype: 'datefield',
								  name : 'bizDate',
								  margin: 5,
								  format:'Y-m-d',
								  fieldLabel: '日期'
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
								,{
								  xtype: 'textareafield',
								  name : 'note',
								  margin: 5,
								  fieldLabel: '备注'
								}
								,{
								  xtype: 'textfield',
								  name : 'id',
								  fieldLabel: 'id',
								  hidden:true
								}
							]
						},
						{
							xtype: 'gridpanel',
							region: 'center',
							store: entryStore,
							columns: [
								{
									xtype: 'gridcolumn',
									dataIndex: 'id',
									text: 'id',
									hidden:true
								}
								,{
									xtype: 'gridcolumn',
									dataIndex: 'parentId',
									text: 'parentId'

								}
								#foreach($entryfield in $EntryFields)
								#if($entryfield.isHidden==false&&$entryfield.type!='entity')//\n
								,{
								  #if($entryfield.type=='string')//\n
								  xtype: 'gridcolumn'
								  ,editor: {
											xtype: 'textfield'
										}
								  #end
								  #if($entryfield.type=='int')//\n
								  xtype: 'numbercolumn'
								  ,format:'0'
								  ,editor: {
											xtype: 'numberfield'
											,allowDecimals:false
											,allowBlank: false
											,hideTrigger:true
										}
								  #end
								  #if($entryfield.type=='float')//\n
								  xtype: 'numbercolumn'
								   ,editor: {
											xtype: 'numberfield'
											,allowBlank: false
											,hideTrigger:true
										}
								  #end
								  #if($entryfield.type=='boolean')//\n
								  xtype: 'checkcolumn'
								  , editor: {
										xtype: 'checkbox'
										,cls: 'x-grid-checkheader-editor'
								  }
								  #end
								  #if($entryfield.type=='date')//\n
								  xtype: 'datecolumn'
								  ,format:'Y-m-d'
								  ,editor: {
										xtype: 'datefield',
										allowBlank: false,
										format: 'Y-m-d'
								   }
								  #end//\n
								  ,dataIndex:'$entryfield.name'
								  ,text: '$entryfield.alias'
								  
								}
								#elseif($entryfield.isHidden==false&&$entryfield.type=='entity')//\n
								,{
									xtype: 'gridcolumn'
									,dataIndex: '${entryfield.name}${entryfield.entity}Id'
									,text: '${entryfield.name}${entryfield.entity}Id'
									,hidden:true
									
								}
								,{
									xtype: 'gridcolumn',
									dataIndex: '${entryfield.name}${entryfield.entity}Name',
									text: '$entryfield.alias',
									editor:{
											  xtype: 'selectorfield',
											  storeName:'${entryfield.entity}Store',//定义数据集名称
											  parentFormName:'${TemplateName}form',
											  name : '${entryfield.name}${entryfield.entity}Name'
										   }
									
								}
								#end 
								#end //\n
							],
							viewConfig: {

							},
							plugins: [cellEditing],
							dockedItems: [
								{
									xtype: 'toolbar',
									dock: 'top',
									items: [
										{
											xtype: 'button',
											text: '分录新增',
											action: 'addLine'
										},
										{
											xtype: 'button',
											text: '分录删除',
											action: 'deleteLine'
										}
									]
								}
							]
						}
	                      
	                  ]
	              }
	          ];
    },
    
    //初始化工具栏
    initToolbar:function(){
    	this.dockedItems=[
	    	{xtype:'toolbar',
	    	items:[{xtye:'button',text:'保存',cls:'x-btn-text-icon',icon:'/scmui/images/icons/save.png',action:'save'}]
	    	}
    	];
    }

});