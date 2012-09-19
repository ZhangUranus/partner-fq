Ext.define('SCM.view.ProductOutwarehouse.ScanUI', {
			extend : 'Ext.window.Window',
			alias : 'widget.ProductOutwarehouseScan',
			height : 600,
			width : 1000,
			title : '扫描出仓',
			layout : 'fit',
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										name : 'ProductOutwarehouseScanform',
										bodyPadding : 5,
										border : 0,
										layout : 'border',
										items : [{
													xtype : 'container',
													height : 250,
													width : 960,
													layout : {
														columns : 5,
														type : 'table',
														tdAttrs : {
															valign : 'top',
															align : 'center'
														}
													},
													region : 'north',
													items : [{
																xtype : 'combobox',
																fieldLabel : '出仓类型',
																name : 'outWarehouseType',
																valueField : 'id',
																displayField : 'name',
																store : SCM.store.basiccode.productOutStatusStore,
																margin : 5,
																colspan : 2,
																width : 320,
																value : '1',	//默认值
																allowBlank : false
															}, {
																xtype : 'label',
																id : 'qantityName',
																text : '扫描板产品数',
																margin : 5,
																style : {
																	'font-weight' : 'bold',
																	'color' : '#A03070',
																	'text-align' : 'center',
																	'font-size' : 20
																}
															}, {
																xtype : 'label',
																id : 'blank-splice1',
																text : ' ',
																margin : 30
															}, {
																xtype : 'label',
																id : 'boardName',
																text : '扫描总板数',
																margin : 5,
																style : {
																	'font-weight' : 'bold',
																	'color' : 'red',
																	'text-align' : 'center',
																	'font-size' : 20
																}
															}, {
																xtype : 'textfield',
																name : 'goodNumber',
																fieldLabel : '货号<font color="red">(用,分割)</font>',
																margin : 5,
																colspan : 2,
																width : 320
															}, {
																xtype : 'label',
																id : 'qantity',
																text : '000',
																rowspan : 5,
																margin : 5,
																style : {
																	'font-weight' : 'bold',
																	'color' : '#A03070',
																	'text-align' : 'center',
																	'font-size' : 140
																}
															}, {
																xtype : 'label',
																id : 'blank-splice2',
																text : ' ',
																rowspan : 5,
																margin : 30
															}, {
																xtype : 'label',
																id : 'boardCount',
																text : '000',
																rowspan : 5,
																margin : 5,
																style : {
																	'font-weight' : 'bold',
																	'color' : 'red',
																	'text-align' : 'center',
																	'font-size' : 140
																}
															}, {
																xtype : 'combogrid',
																fieldLabel : '装货仓库',
																name : 'warehouseId',
																valueField : 'id',
																displayField : 'name',
																initStore : Ext.data.StoreManager.lookup('WHComboInitStore'),
																store : Ext.data.StoreManager.lookup('WHComboStore'),
																margin : 5,
																colspan : 2,
																width : 320,
																matchFieldWidth : false,
																allowBlank : false,
																listConfig : {
																	width : 185,
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
															}, {
																xtype : 'combogrid',
																fieldLabel : '包装车间',
																name : 'workshopId',
																valueField : 'id',
																displayField : 'name',
																initStore : Ext.data.StoreManager.lookup('WSComboInitStore'),
																store : Ext.data.StoreManager.lookup('WSComboStore'),
																margin : 5,
																colspan : 2,
																width : 320,
																matchFieldWidth : false,
																listConfig : {
																	width : 320,
																	height : SCM.MaxSize.COMBOGRID_HEIGHT,
																	columns : [{
																				header : '编码',
																				dataIndex : 'number',
																				width : 100,
																				hideable : false
																			}, {
																				header : '名称',
																				dataIndex : 'name',
																				width : 180,
																				hideable : false
																			}]
																}
															}, {
																xtype : 'textfield',
																name : 'barcode1',
																fieldLabel : '产品条码',
																margin : 5,
																colspan : 2,
																width : 320
															}, {
																xtype : 'textfield',
																name : 'barcode2',
																fieldLabel : '序列号',
																margin : 5,
																colspan : 2,
																width : 320
															}, {
																xtype : 'button',
																text : '出仓情况查询',
																margin : 10,
																iconCls : 'system-search',
																action : 'search',
																tdAttrs : {
																	align : 'left'
																}
															}, {
																xtype : 'button',
																text : '出货通知状态查询',
																margin : 10,
																iconCls : 'system-search',
																action : 'searchNoti',
																tdAttrs : {
																	align : 'left'
																}
															}]
												}, {
													xtype : 'gridpanel',
													margin : '1 0 0 0',
													title : '',
													region : 'center',
													multiSelect : true,
													store : Ext.data.StoreManager.lookup('POHEntryStore'),
													columns : [{
																header : '序号',
																xtype : 'rownumberer',
																width : 40
															}, {
																xtype : 'datecolumn',
																dataIndex : 'lastUpdatedStamp',
																format : 'Y-m-d H:i:s',
																groupable : false,
																text : '日期',
																width : 200
															}, {
																xtype : 'combocolumn',
																renderer : SCM.store.basiccode.productOutStatusRenderer,
																dataIndex : 'outwarehouseType',
																text : '出仓类型',
																editor : {
																	xtype : 'combobox',
																	store : SCM.store.basiccode.productOutStatusStore,
																	displayField : 'name',
																	valueField : 'id',
																	readOnly : true
																}
															}, {
																xtype : 'combocolumn',
																dataIndex : 'materialMaterialId',
																text : '成品名称',
																gridId : 'ProductOutwarehouse-scan-grid',
																editor : {
																	xtype : 'combobox',
																	valueField : 'id',
																	displayField : 'name',
																	initStore : Ext.data.StoreManager.lookup('MComboInitStore'),
																	store : Ext.data.StoreManager.lookup('MComboStore'),
																	readOnly : true
																}
															}, {
																xtype : 'combocolumn',
																dataIndex : 'unitUnitId',
																text : '单位',
																gridId : 'ProductOutwarehouse-scan-grid',
																editor : {
																	xtype : 'combobox',
																	valueField : 'id',
																	displayField : 'name',
																	initStore : Ext.data.StoreManager.lookup('UComboInitStore'),
																	store : Ext.data.StoreManager.lookup('UComboStore'),
																	readOnly : true
																},
																width : 80
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'barcode1',
																text : '产品条码'

															}, {
																xtype : 'gridcolumn',
																dataIndex : 'barcode2',
																text : '序列号'

															}, {
																xtype : 'combocolumn',
																dataIndex : 'workshopWorkshopId',
																text : '车间',
																editor : {
																	xtype : 'combogrid',
																	valueField : 'id',
																	displayField : 'name',
																	initStore : Ext.data.StoreManager.lookup('WSComboInitStore'),
																	store : Ext.data.StoreManager.lookup('WSComboStore'),
																	matchFieldWidth : false,
																	readOnly : true
																}
															}, {
																xtype : 'combocolumn',
																dataIndex : 'warehouseWarehouseId',
																text : '仓库',
																editor : {
																	xtype : 'combogrid',
																	valueField : 'id',
																	displayField : 'name',
																	initStore : Ext.data.StoreManager.lookup('WHComboInitStore'),
																	store : Ext.data.StoreManager.lookup('WHComboStore'),
																	matchFieldWidth : false,
																	readOnly : true
																}
															}],
													viewConfig : {

													}
												}]
									}]

						});

				this.callParent(arguments);
			},
			close : function() {
				this.hide();
			}
		});