Ext.define('SCM.view.PurchaseBill.EditUI', {
    extend: 'Ext.window.Window',
    alias : 'widget.PurchaseBilledit',

	height: 550,
	width: 815,
    title : '采购单编辑',
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
								  xtype: 'selectorfield',
								  storeName:'SupplierStore',//定义数据集名称
								  parentFormName:'PurchaseBillform',
								  name : 'supplierSupplierId',
								  margin: 5,
								  fieldLabel: '供应商'
								}
																								//\n
								,{
								  xtype: 'selectorfield',
								  storeName:'UserStore',//定义数据集名称
								  parentFormName:'PurchaseBillform',
								  name : 'purchserTSystemUserId',
								  margin: 5,
								  fieldLabel: '采购员'
								}
																								//\n
								,{
								  xtype: 'selectorfield',
								  storeName:'UserStore',//定义数据集名称
								  parentFormName:'PurchaseBillform',
								  name : 'auditerTSystemUserId',
								  margin: 5,
								  fieldLabel: '审核员'
								}
																								//\n
								,{
								  								  								  //\n
								  xtype: 'numberfield'
								  ,hideTrigger:true
								  ,fieldLabel: '总金额'
								  								  								  //\n
								   //\n
								  ,name : 'totolAccount'
								  ,margin: 5
								  
								}
																 //\n
								,{
								  xtype: 'textfield',
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
									xtype: 'gridcolumn'
									,dataIndex: 'materialMaterialId'
									,text: 'materialMaterialId'
									,hidden:true
									
								}
								,{
									xtype: 'gridcolumn',
									dataIndex: 'materialMaterialName',
									text: '物料',
									editor:{
											  xtype: 'selectorfield',
											  storeName:'MaterialStore',//定义数据集名称
											  parentFormName:'PurchaseBillform',
											  name : 'materialMaterialName'
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
								  ,dataIndex:'amount'
								  ,text: '数量'
								  
								}
																								//\n
								,{
									xtype: 'gridcolumn'
									,dataIndex: 'unitUnitId'
									,text: 'unitUnitId'
									,hidden:true
									
								}
								,{
									xtype: 'gridcolumn',
									dataIndex: 'unitUnitName',
									text: '单位',
									editor:{
											  xtype: 'selectorfield',
											  storeName:'UnitStore',//定义数据集名称
											  parentFormName:'PurchaseBillform',
											  name : 'unitUnitName'
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
								  ,dataIndex:'price'
								  ,text: '单价'
								  
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
								  ,dataIndex:'refPrice'
								  ,text: '参考单价'
								  
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
								  ,dataIndex:'account'
								  ,text: '金额'
								  
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