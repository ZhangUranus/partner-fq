Ext.define('SCM.view.PurchaseBill.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.PurchaseBilledit',

	height: 550,
	width: 815,
    title : 'PurchaseBill',
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
		var entryStore=Ext.create('PurchaseBillEditEntryStore');
    	this.items = [
					  {
						  xtype: 'form',
						  name:'PurchaseBillform',
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
																//\n
								,{
								  //\n
								  xtype: 'textfield'
								  ,fieldLabel: '自定义字段1'
								  								  								  								  								  //\n
								   //\n
								  ,name : 'myfield1'
								  ,margin: 5
								  
								}
																								//\n
								,{
								  								  								  								  								  //\n
								  xtype: 'datefield'
								  ,format:'Y-m-d'
								  ,fieldLabel: '自定义字段2'
								  //\n
								   //\n
								  ,name : 'myfield2'
								  ,margin: 5
								  
								}
																								//\n
								,{
								  								  								  								  //\n
								  xtype: 'checkboxfield'
								  ,uncheckedValue:false
								  ,inputValue:true
								  ,boxLabel:'自定义字段3'
								  								  //\n
								   //\n
								  ,name : 'myfield3'
								  ,margin: 5
								  
								}
																								//\n
								,{
								  xtype: 'selectorfield',
								  storeName:'UnitStore',//定义数据集名称
								  parentFormName:'PurchaseBillform',
								  name : 'myfield4UnitId',
								  margin: 5,
								  fieldLabel: '自定义字段4'
								}
																								//\n
								,{
								  								  //\n
								  xtype: 'numberfield'
								  ,allowDecimals:false
								  ,hideTrigger:true
								  ,fieldLabel: '自定义字段5'
								  								  								  								  //\n
								   //\n
								  ,name : 'myfield5'
								  ,margin: 5
								  
								}
																								//\n
								,{
								  								  								  								  								  //\n
								   //\n
								  xtype: 'combobox'
								  ,fieldLabel: '自定义字段6'
								  ,store:Ext.partner.basiccode.billStatusStore
								  ,displayField:'name'
								  ,valueField:'id'
								  //\n
								  ,name : 'myField6'
								  ,margin: 5
								  
								}
																 //\n
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
																//\n
								,{
								  //\n
								  xtype: 'gridcolumn'
								  ,editor: {
											xtype: 'textfield'
										}
								  								  								  								  								  //\n
								  //\n
								  ,dataIndex:'myentryfield1'
								  ,text: '自定义字段1'
								  
								}
																								//\n
								,{
								  								  								  								  								  //\n
								  xtype: 'datecolumn'
								  ,format:'Y-m-d'
								  ,editor: {
										xtype: 'datefield'
										,allowBlank: false
										,format: 'Y-m-d'
								   }
								  //\n
								  //\n
								  ,dataIndex:'myentryfield2'
								  ,text: '自定义字段2'
								  
								}
																								//\n
								,{
								  								  								  								  //\n
								  xtype: 'checkcolumn'
								  , editor: {
										xtype: 'checkbox'
										,cls: 'x-grid-checkheader-editor'
								  }
								  								  //\n
								  //\n
								  ,dataIndex:'myentryfield3'
								  ,text: '自定义字段3'
								  
								}
																								//\n
								,{
									xtype: 'gridcolumn'
									,dataIndex: 'myentryfield4UnitId'
									,text: 'myentryfield4UnitId'
									,hidden:true
									
								}
								,{
									xtype: 'gridcolumn',
									dataIndex: 'myentryfield4UnitName',
									text: '自定义字段4',
									editor:{
											  xtype: 'selectorfield',
											  storeName:'UnitStore',//定义数据集名称
											  parentFormName:'PurchaseBillform',
											  name : 'myentryfield4UnitName'
										   }
									
								}
																								//\n
								,{
								  								  								  //\n
								  xtype: 'numbercolumn'
								   ,editor: {
											xtype: 'numberfield'
											,allowBlank: false
											,hideTrigger:true
										}
								  								  								  //\n
								  //\n
								  ,dataIndex:'myentryfield5'
								  ,text: '自定义字段5'
								  
								}
																								//\n
								,{
								  								  //\n
								  xtype: 'numbercolumn'
								  ,format:'0'
								  ,editor: {
											xtype: 'numberfield'
											,allowDecimals:false
											,allowBlank: false
											,hideTrigger:true
										}
								  								  								  								  //\n
								  //\n
								  ,dataIndex:'myentryfield6'
								  ,text: '自定义字段6'
								  
								}
																								//\n
								,{
								  								  								  								  								  //\n
								  //\n
								  xtype: 'gridcolumn'
								  ,renderer:Ext.partner.basiccode.billStatusRenderer
								  ,editor: {
										xtype: 'combobox'
										,store:Ext.partner.basiccode.billStatusStore
										,displayField:'name'
										,valueField:'id'
								   }
								  //\n
								  ,dataIndex:'myentryfield7'
								  ,text: '自定义字段7'
								  
								}
																 //\n
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
								  xtype: 'datefield',
								  name : 'createdStamp',
								  format:'Y-m-d H:i:s',
								  disabled:true,
								  margin: 5,
								  fieldLabel: '创建时间'
								}
								,{
								  xtype: 'datefield',
								  name : 'lastUpdatedStamp',
								  margin: 5,
								  format:'Y-m-d H:i:s',
								  disabled:true,
								  fieldLabel: '最后更新时间'
								}]
						}
	                  ]
	              }
	          ];//结束items
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