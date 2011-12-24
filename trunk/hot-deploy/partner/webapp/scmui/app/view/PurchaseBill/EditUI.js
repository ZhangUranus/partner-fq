Ext.define('SCM.view.PurchaseBill.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.PurchaseBilledit',

	height: 450,
	width: 600,
    title : 'PurchaseBill',
    layout: 'fit',
    autoShow: true,
    modal:true,//背景变灰，不能编辑
    uiStatus:'AddNew',
    
	requires: ['SCM.ux.SelectorField'],

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
							height: 120,
							layout: {
								columns: 2,
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
								},
								{
									xtype: 'gridcolumn',
									dataIndex: 'parentId',
									text: 'parentId'

								}
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