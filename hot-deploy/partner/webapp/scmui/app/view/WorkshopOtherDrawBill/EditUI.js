Ext.define('SCM.view.WorkshopOtherDrawBill.EditUI', {
    extend: 'Ext.window.Window',
    requires: ['SCM.extend.toolbar.SaveToolbar','SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
    alias : 'widget.WorkshopOtherDrawBilledit',
	height: 550,
	width: 815,
    title : '车间其它领料',
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
		var entryStore=Ext.create('WorkshopOtherDrawBillEditEntryStore');
		
		Ext.applyIf(me, {
					items : [
					  {
						  xtype: 'form',
						  name:'WorkshopOtherDrawBillform',
						  bodyPadding:5,
						  border : 0,
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
								    fieldLabel : '车间',
								    name : 'workshopWorkshopId',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('WorkshopStore'),
									margin: 5,
									matchFieldWidth:false,
									allowBlank : false,
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
								    fieldLabel : '领料人',
								    name : 'buyerSystemUserId',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('SystemUserStore'),
									margin: 5,
									matchFieldWidth:false,
									allowBlank : false,
									readOnly : true,
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
								    fieldLabel : '提交人',
								    name : 'submitterSystemUserId',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('SystemUserStore'),
									margin: 5,
									matchFieldWidth:false,
									readOnly : true,
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
								  ,name : 'totalsum'
								  ,readOnly : true
								  ,margin: 5
								  
								}
								,{
								  xtype: 'textarea',
								  name : 'note',
								  margin: 5,
								  fieldLabel: '备注',
								  maxLength : 50,
								  colspan : 3,
								  width : 785
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
							id : 'WorkshopOtherDrawBill-edit-grid',
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
									xtype : 'combocolumn',
									dataIndex : 'warehouseWarehouseId',
									text : '仓库',
									gridId : 'WorkshopOtherDrawBill-edit-grid',
									editor : {
										xtype : 'combogrid',
										valueField : 'id',
										displayField : 'name',
										initStore : Ext.data.StoreManager.lookup('WHComboInitStore'),
										store : Ext.data.StoreManager.lookup('WHComboStore'),
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
																								//\n
							,{
									xtype : 'combocolumn',
									dataIndex : 'materialMaterialId',
									text : '物料',
									gridId : 'WorkshopOtherDrawBill-edit-grid',
									editor : {
										xtype : 'combogrid',
										valueField : 'id',
										displayField : 'name',
										initStore : Ext.data.StoreManager.lookup('MWHComboInitStore'),
										store : Ext.data.StoreManager.lookup('MWHComboStore'),
										matchFieldWidth : false,
										listeners : {
											scope : this,
											beforequery : function(qe){
												return this.setEntryMaterialFilter(qe);
											}
										},
										listConfig : {
											width : 400,
											height : SCM.MaxSize.COMBOGRID_HEIGHT,
											columns : [{
														header : '编码',
														dataIndex : 'number',
														width : 100,
														hideable : false
													}, {
														header : '名称',
														dataIndex : 'name',
														width : 280,
														hideable : false
													}]
										}
									}
							 }
								,{
										xtype : 'gridcolumn',
										dataIndex : 'materialMaterialModel',
										text : '规格型号'
							    }
								,{
								  xtype: 'numbercolumn'
								   ,editor: {
											xtype: 'numberfield'
											,allowBlank: false
											,hideTrigger:true
										}
								  ,dataIndex:'volume'
								  ,text: '数量'
								  
								}
								,{
									xtype : 'combocolumn',
									dataIndex : 'unitUnitId',
									text : '单位',
									gridId : 'WorkshopOtherDrawBill-edit-grid',
									editor : {
										xtype : 'combobox',
										valueField : 'id',
										displayField : 'name',
										initStore : Ext.data.StoreManager.lookup('UComboInitStore'),
										store : Ext.data.StoreManager.lookup('UComboStore'),
										readOnly : true
									},
									width : 80
								}			
								,{						  							
								  xtype: 'numbercolumn'
								  ,dataIndex:'price'
								  ,text: '单价'
									  
								}											
//								,{		  								  
//								  xtype: 'numbercolumn'
//								  ,dataIndex:'refPrice'
//								  ,text: '参考单价'
//								}												
								,{				  								 
								  xtype: 'numbercolumn'
								  ,dataIndex:'entrysum'
								  ,text: '金额'
								  
								}
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
						type : 'bill',
						dock : 'bottom'
					}]
		});
    	
        this.callParent(arguments);
    },
    close : function() {
				this.hide();
				this.inited = false;
				this.modifyed = false;
	},
	setEntryMaterialFilter : function(qe){
		var entryGrid = this.down('gridpanel');
		var selRec = entryGrid.getSelectionModel().getLastSelected();
		
		//根据所选仓库过滤物料
		var materialEntryStore = qe.combo.store;
		if(materialEntryStore){
			materialEntryStore.getProxy().extraParams.whereStr = "warehouse_Id ='" + selRec.get('warehouseWarehouseId') +"'";
		}
		return true;
	}

});