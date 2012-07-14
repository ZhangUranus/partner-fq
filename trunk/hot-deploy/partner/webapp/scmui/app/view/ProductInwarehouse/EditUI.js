Ext.define('SCM.view.ProductInwarehouse.EditUI', {
    extend: 'Ext.window.Window',
    requires: ['SCM.extend.toolbar.SaveToolbar','SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
    alias : 'widget.ProductInwarehouseedit',
	height: 550,
	width: 815,
    title : '成品进仓单',
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
		var entryStore=Ext.create('ProductInwarehouseEditEntryStore');
		
		Ext.applyIf(me, {
					items : [
					  {
						  xtype: 'form',
						  name:'ProductInwarehouseform',
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
								,{
								    xtype : 'combogrid',
								    fieldLabel : '领料人',
								    name : 'inspectorSystemUserId',
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
								,{
								    xtype : 'combogrid',
								    fieldLabel : '提交人',
								    name : 'submitterSystemUserId',
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
								,{
								  xtype: 'numberfield'
								  ,hideTrigger:true
								  ,fieldLabel: '总金额'
								  ,name : 'totalsum'
								  ,margin: 5
								  
								}
								,{
										xtype : 'label'
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
							id : 'ProductInwarehouse-edit-grid',
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
								,{
								xtype : 'combocolumn'
								,dataIndex : 'workshopWorkshopId'
								,text : '车间'
								,gridId : 'ProductInwarehouse-edit-grid'
								,editor : {
									xtype : 'combogrid',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('WorkshopStore'),
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
								xtype : 'combocolumn'
								,dataIndex : 'warehouseWarehouseId'
								,text : '仓库'
								,gridId : 'ProductInwarehouse-edit-grid'
								,editor : {
									xtype : 'combogrid',
									valueField : 'id',
									displayField : 'name',
									store : Ext.create('WarehouseStore'),
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
								xtype : 'combocolumn'
								,dataIndex : 'materialMaterialId'
								,text : '物料'
								,gridId : 'ProductInwarehouse-edit-grid'
								,width:300
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
								xtype : 'combocolumn'
								,dataIndex : 'unitUnitId'
								,text : '单位'
								,gridId : 'ProductInwarehouse-edit-grid'
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
								  xtype: 'numbercolumn'
								   ,editor: {
											xtype: 'numberfield'
											,allowBlank: false
											,hideTrigger:true
										}
								  ,dataIndex:'price'
								  ,text: '单价'
								  
								}
								,{
								  xtype: 'numbercolumn'
								   ,editor: {
											xtype: 'numberfield'
											,allowBlank: false
											,hideTrigger:true
										}
								  ,dataIndex:'entrysum'
								  ,text: '金额'
								  
								}
								,{
								  xtype: 'gridcolumn'
								  ,editor: {
											xtype: 'textfield'
										}
								  ,dataIndex:'barcode1'
								  ,text: '条码1'
								  
								}
								,{
								  xtype: 'gridcolumn'
								  ,editor: {
											xtype: 'textfield'
										}
								  ,dataIndex:'barcode2'
								  ,text: '条码2'
								  
								}
								,{
								  xtype: 'gridcolumn'
								  ,renderer:SCM.store.basiccode.productInStatusRenderer
								  ,editor: {
										xtype: 'combobox'
										,store:SCM.store.basiccode.productInStatusStore
										,displayField:'name'
										,valueField:'id'
								   }
								  ,dataIndex:'inwarehouseType'
								  ,text: '进仓类型'
								  
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
			}

});