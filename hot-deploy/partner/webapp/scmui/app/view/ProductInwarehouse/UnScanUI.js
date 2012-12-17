Ext.define('SCM.view.ProductInwarehouse.UnScanUI', {
			extend : 'Ext.window.Window',
			alias : 'widget.ProductInwarehouseUnScan',
			height : 600,
			width : 1000,
			title : '撤销扫描',
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
										name : 'ProductInwarehouseUnScanform',
										bodyPadding : 5,
										border : 0,
										layout : 'border',
										items : [{
													xtype : 'container',
													height : 50,
													width : 960,
													layout : {
														columns : 3,
														type : 'table',
														border : 1,
														tableAttrs : {
															style : {
																'border' : '1px',
																'border-width' : '1px'
															}
														},
														tdAttrs : {
															valign : 'top',
															align : 'center'
														}
													},
													region : 'north',
													items : [{
																xtype : 'textfield',
																name : 'barcode1',
																fieldLabel : '产品条码',
																margin : 10,
																width : 350
															}, {
																xtype : 'textfield',
																name : 'barcode2',
																fieldLabel : '序列号',
																margin : 10,
																width : 350
															}]
												}, {
													xtype : 'gridpanel',
													margin : '1 0 0 0',
													title : '',
													region : 'center',
													multiSelect : true,
													store : 'ProductInwarehouse.ProductInwarehouseEntryExtStore',
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
																renderer : SCM.store.basiccode.productInStatusRenderer,
																dataIndex : 'inwarehouseType',
																text : '进仓类型',
																editor : {
																	xtype : 'combobox',
																	store : SCM.store.basiccode.productInStatusStore,
																	displayField : 'name',
																	valueField : 'id',
																	readOnly : true
																}
															}, {
																xtype : 'combocolumn',
																dataIndex : 'materialMaterialId',
																text : '成品名称',
																gridId : 'ProductInwarehouse-scan-grid',
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
																gridId : 'ProductInwarehouse-scan-grid',
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
			}
		});