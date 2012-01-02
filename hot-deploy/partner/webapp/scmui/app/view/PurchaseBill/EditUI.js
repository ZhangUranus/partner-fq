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
								  ,name : 'myfield5'
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
								  ,dataIndex:'myentryfield1'
								  ,text: '自定义字段1'
								  
								}
																								//\n
								,{
								  								  								  								  								  //\n
								  xtype: 'datecolumn'
								  ,format:'Y-m-d'
								  ,editor: {
										xtype: 'datefield',
										allowBlank: false,
										format: 'Y-m-d'
								   }
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
								  ,dataIndex:'myentryfield6'
								  ,text: '自定义字段6'
								  
								}
																 //\n
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