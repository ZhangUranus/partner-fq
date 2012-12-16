Ext.define('SCM.view.ProductReturn.ScanUI', {
			extend : 'Ext.window.Window',
			alias : 'widget.ProductReturnScan',
			height : 600,
			width : 1000,
			title : '扫描退货',
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
										name : 'ProductReturnScanform',
										bodyPadding : 5,
										border : 0,
										layout : 'border',
										items : [{
													xtype : 'container',
													height : 300,
													width : 960,
													layout : {
														columns : 4,
														type : 'table',
														tdAttrs : {
															valign : 'top',
															align : 'center'
														}
													},
													region : 'north',
													items : [{
																xtype : 'combogrid',
																fieldLabel : '装货仓库',
																name : 'warehouseId',
																valueField : 'id',
																displayField : 'name',
																initStore : Ext.data.StoreManager.lookup('WHComboInitStore'),
																store : Ext.data.StoreManager.lookup('WHComboStore'),
																margin : 5,
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
																xtype : 'label',
																name : 'qantityName',
																text : '扫描板产品数',
																margin : 10,
																style : {
																	'font-weight' : 'bold',
																	'color' : '#A03070',
																	'text-align' : 'center',
																	'font-size' : 20
																}
															}, {
																xtype : 'label',
																name : 'blank-splice1',
																text : ' ',
																margin : 30
															}, {
																xtype : 'label',
																name : 'boardName',
																text : '扫描总板数',
																margin : 10,
																style : {
																	'font-weight' : 'bold',
																	'color' : 'red',
																	'text-align' : 'center',
																	'font-size' : 20
																}
															}, {
																xtype : 'textfield',
																name : 'barcode1',
																fieldLabel : '产品条码',
																margin : 5,
																width : 320
															}, {
																xtype : 'label',
																name : 'qantity',
																text : '0000',
																rowspan : 7,
																margin : 10,
																style : {
																	'font-weight' : 'bold',
																	'color' : '#A03070',
																	'text-align' : 'center',
																	'font-size' : 140
																}
															}, {
																xtype : 'label',
																name : 'blank-splice2',
																text : ' ',
																rowspan : 7,
																margin : 30
															}, {
																xtype : 'label',
																name : 'boardCount',
																text : '0',
																rowspan : 7,
																margin : 10,
																style : {
																	'font-weight' : 'bold',
																	'color' : 'red',
																	'text-align' : 'center',
																	'font-size' : 140
																}
															}, {
																xtype : 'textfield',
																name : 'barcode2',
																fieldLabel : '序列号',
																margin : 5,
																width : 320
															}, {
																xtype : 'textfield',
																name : 'confirmBarcode1',
																fieldLabel : '确认产品条码',
																margin : 5,
																width : 320
															}, {
																xtype : 'textfield',
																name : 'confirmBarcode2',
																fieldLabel : '确认序列号',
																margin : 5,
																width : 320
															}, {
																xtype : 'textfield',
																name : 'ikeaCode',
																fieldLabel : '宜家编码',
																margin : 5,
																width : 320
															}]
												}
//												, {
//													xtype : 'gridpanel',
//													margin : '1 0 0 0',
//													title : '',
//													region : 'center',
//													multiSelect : true,
//													store : 'ProductReturn.ProductReturnEditEntryStore',
//													columns : [{
//																header : '序号',
//																xtype : 'rownumberer',
//																width : 40
//															}, {
//																xtype : 'datecolumn',
//																dataIndex : 'lastUpdatedStamp',
//																format : 'Y-m-d H:i:s',
//																groupable : false,
//																text : '日期',
//																width : 200
//															}, {
//																xtype : 'combocolumn',
//																renderer : SCM.store.basiccode.productInStatusRenderer,
//																dataIndex : 'inwarehouseType',
//																text : '进仓类型',
//																editor : {
//																	xtype : 'combobox',
//																	store : SCM.store.basiccode.productInStatusStore,
//																	displayField : 'name',
//																	valueField : 'id',
//																	readOnly : true
//																}
//															}, {
//																xtype : 'combocolumn',
//																dataIndex : 'materialMaterialId',
//																text : '成品名称',
//																gridId : 'ProductReturn-scan-grid',
//																editor : {
//																	xtype : 'combobox',
//																	valueField : 'id',
//																	displayField : 'name',
//																	initStore : Ext.data.StoreManager.lookup('MComboInitStore'),
//																	store : Ext.data.StoreManager.lookup('MComboStore'),
//																	readOnly : true
//																}
//															}, {
//																xtype : 'combocolumn',
//																dataIndex : 'unitUnitId',
//																text : '单位',
//																gridId : 'ProductReturn-scan-grid',
//																editor : {
//																	xtype : 'combobox',
//																	valueField : 'id',
//																	displayField : 'name',
//																	initStore : Ext.data.StoreManager.lookup('UComboInitStore'),
//																	store : Ext.data.StoreManager.lookup('UComboStore'),
//																	readOnly : true
//																},
//																width : 80
//															}, {
//																xtype : 'gridcolumn',
//																dataIndex : 'barcode1',
//																text : '产品条码'
//
//															}, {
//																xtype : 'gridcolumn',
//																dataIndex : 'barcode2',
//																text : '序列号'
//
//															}, {
//																xtype : 'combocolumn',
//																dataIndex : 'workshopWorkshopId',
//																text : '车间',
//																editor : {
//																	xtype : 'combogrid',
//																	valueField : 'id',
//																	displayField : 'name',
//																	initStore : Ext.data.StoreManager.lookup('WSComboInitStore'),
//																	store : Ext.data.StoreManager.lookup('WSComboStore'),
//																	matchFieldWidth : false,
//																	readOnly : true
//																}
//															}, {
//																xtype : 'combocolumn',
//																dataIndex : 'warehouseWarehouseId',
//																text : '仓库',
//																editor : {
//																	xtype : 'combogrid',
//																	valueField : 'id',
//																	displayField : 'name',
//																	initStore : Ext.data.StoreManager.lookup('WHComboInitStore'),
//																	store : Ext.data.StoreManager.lookup('WHComboStore'),
//																	matchFieldWidth : false,
//																	readOnly : true
//																}
//															}],
//													viewConfig : {
//
//													}
//												}
												]
									}]

						});

				this.callParent(arguments);
			},
			close : function() {
				this.hide();
			}
		});