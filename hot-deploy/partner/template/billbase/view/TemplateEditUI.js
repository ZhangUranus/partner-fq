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
						  //开始container
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
						//开始gridpanel
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
									text: 'parentId',
									hidden:true

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
										xtype: 'datefield'
										,allowBlank: false
										,format: 'Y-m-d'
								   }
								  #end//\n
								  #if($entryfield.type=='enum')//\n
								  xtype: 'gridcolumn'
								  ,renderer:$entryfield.enumRender
								  ,editor: {
										xtype: 'combobox'
										,store:$entryfield.enumStore
										,displayField:'name'
										,valueField:'id'
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
							],//end columns
							viewConfig: {

							},
							plugins: [cellEditing],
							//开始工具栏
							dockedItems: [
								{
									xtype: 'toolbar',
									dock: 'top',
									items: [
										{
											xtype: 'button'
											,text: '分录新增'
											,cls:'x-btn-text-icon'
											,icon:'/scmui/images/icons/addline.gif'
											,action: 'addLine'
										},
										{
											xtype: 'button'
											,text: '分录删除'
											,cls:'x-btn-text-icon'
											,icon:'/scmui/images/icons/dline.gif'
											,action: 'deleteLine'
										}
									]
								}
							]//end工具栏
						}//end gridpanel
	                    ,{
							xtype: 'container',
							height: 50,
							layout: {
								columns: 3,
								type: 'table'
								},
							region: 'south',
							items: [
									
							       {
								  xtype: 'datefield'
								  ,name : 'createdStamp'
								  ,format:'Y-m-d H:i:s'
								  ,readOnly:true
								  ,margin: 5
								  ,fieldLabel: '创建时间'
								}
								,{
								  xtype: 'datefield'
								  ,name : 'lastUpdatedStamp'
								  ,margin: 5
								  ,format:'Y-m-d H:i:s'
								  ,readOnly:true
								  ,fieldLabel: '最后更新时间'
								}
								,{
								  xtype: 'combobox'
								  ,store:Ext.partner.basiccode.billStatusStore
								  ,name : 'status'
								  ,displayField:'name'
								  ,margin: 5
								  ,valueField:'id'
								  ,readOnly:true
								  ,fieldLabel:'单据状态'
								}
								]
						}
	                  ]
	              }
	          ];//结束items
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