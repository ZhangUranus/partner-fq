Ext.define('SCM.view.PurchaseBill.EditUI', {
    extend: 'Ext.window.Window',
    requires: ['SCM.extend.toolbar.SaveToolbar','SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
    alias : 'widget.PurchaseBilledit',
	height: 550,
	width: 815,
    title : '采购单',
    layout: 'fit',
    modal:true,//背景变灰，不能编辑
    collapsible : true,
	resizable : false,
	closeAction:'hide',
	uiStatus:'AddNew',
	inited : false,
	modifyed : false,
    initComponent: function() {
    	var me = this;
    	var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit: 1
		});
		var entryStore=Ext.create('PurchaseBillEditEntryStore');
		
		Ext.applyIf(me, {
					items : [
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
								  fieldLabel: '编码',
								  emptyText : '保存时系统自动生成',
								  readOnly : true
								 }
								,{
								  xtype: 'datefield',
								  name : 'bizDate',
								  margin: 5,
								  format:'Y-m-d',
								  fieldLabel: '日期',
								  allowBlank : false
								}
																//\n
								,{
								    xtype : 'combogrid',
								    fieldLabel : '供应商',
								    name : 'supplierSupplierId',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('SupplierStore'),
									margin: 5,
									matchFieldWidth:false,
									listConfig : {
										width:185,
										height : SCM.MaxSize.COMBOGRID_HEIGHT,
										columns : [{
													header : '编码',
													dataIndex : 'number',
													width : 100,
													hideable : false
													}, {
													header : '名称',
													dataIndex : 'name',
													width : 80,
													hideable : false
													}]
									}
								}
																								//\n
								,{
								    xtype : 'combogrid',
								    fieldLabel : '采购员',
								    name : 'buyerSystemUserId',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('SystemUserStore'),
									margin: 5,
									matchFieldWidth:false,
									listConfig : {
										width:185,
										height : SCM.MaxSize.COMBOGRID_HEIGHT,
										columns : [{
													header : '编码',
													dataIndex : 'number',
													width : 100,
													hideable : false
													}, {
													header : '名称',
													dataIndex : 'name',
													width : 80,
													hideable : false
													}]
									}
								}
																								//\n
								,{
								    xtype : 'combogrid',
								    fieldLabel : '审核员',
								    name : 'approverSystemUserId',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('SystemUserStore'),
									margin: 5,
									matchFieldWidth:false,
									listConfig : {
										width:185,
										height : SCM.MaxSize.COMBOGRID_HEIGHT,
										columns : [{
													header : '编码',
													dataIndex : 'number',
													width : 100,
													hideable : false
													}, {
													header : '名称',
													dataIndex : 'name',
													width : 80,
													hideable : false
													}]
									}
								}
																								//\n
								,{
								  								  								  //\n
								  xtype: 'numberfield'
								  ,hideTrigger:true
								  ,fieldLabel: '总金额'
								  								  								  //\n
								   //\n
								  ,name : 'totalsum'
								  ,margin: 5
								  
								}
																 //\n
								,{
								  xtype: 'textfield',
								  name : 'note',
								  margin: 5,
								  fieldLabel: '备注',
								  maxLength : 50
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
							id : 'PurchaseBill-edit-grid',
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
								xtype : 'combocolumn'
								,dataIndex : 'materialMaterialId'
								,text : '物料'
								,gridId : 'PurchaseBill-edit-grid'
								,editor : {
									xtype : 'combogrid',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('MaterialStore'),
									matchFieldWidth : false,
									
									listConfig : {
										width : SCM.MaxSize.COMBOGRID_WIDTH,
										height : SCM.MaxSize.COMBOGRID_HEIGHT,
										columns : [{
													header : '编码',
													dataIndex : 'number',
													width : 100,
													hideable : false
												}, {
													header : '名称',
													dataIndex : 'name',
													width : 80,
													hideable : false
												}]
									}
								}
							 }
							 ,{
								xtype : 'gridcolumn'
								,dataIndex : 'materialMaterialName'
								,text : '物料Name'
								,hidden:true
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
								  ,dataIndex:'volume'
								  ,text: '数量'
								  
								}
																								//\n
								,{
								xtype : 'combocolumn'
								,dataIndex : 'unitUnitId'
								,text : '单位'
								,gridId : 'PurchaseBill-edit-grid'
								,editor : {
									xtype : 'combogrid',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('UnitStore'),
									matchFieldWidth : false,
									
									listConfig : {
										width : SCM.MaxSize.COMBOGRID_WIDTH,
										height : SCM.MaxSize.COMBOGRID_HEIGHT,
										columns : [{
													header : '编码',
													dataIndex : 'number',
													width : 100,
													hideable : false
												}, {
													header : '名称',
													dataIndex : 'name',
													width : 80,
													hideable : false
												}]
									}
								}
							 }
							 ,{
								xtype : 'gridcolumn'
								,dataIndex : 'unitUnitName'
								,text : '单位Name'
								,hidden:true
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
								  ,dataIndex:'entrysum'
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
									xtype : 'gridedittoolbar',
									dock : 'top'
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
								  ,store:SCM.store.basiccode.billStatusStore
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
	          ],
	    dockedItems : [{
						xtype : 'savetoolbar',
						dock : 'bottom'
					}]
		});
    	
        this.callParent(arguments);
    },
    close : function() {
				this.hide();
				this.inited = false;
				this.modifyed = false;
			}

});