Ext.define('SCM.view.PurchaseWarehousing.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.PurchaseWarehousingedit',
			height : 550,
			width : 815,
			title : '采购入库单',
			layout : 'fit',
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			uiStatus : 'AddNew',
			inited : false,
			modifyed : false,
			initComponent : function() {
				var me = this;
				var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1
						});
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										name : 'PurchaseWarehousingform',
										bodyPadding : 5,
										border : 0,
										layout : 'border',
										items : [{
													xtype : 'container',
													height : 200,
													layout : {
														columns : 3,
														type : 'table'
													},
													region : 'north',
													items : [{
																xtype : 'textfield',
																name : 'number',
																margin : 5,
																fieldLabel : '编码',
																emptyText : '保存时系统自动生成',
																readOnly : true
															}, {
																xtype : 'datefield',
																name : 'bizDate',
																margin : 5,
																format : 'Y-m-d',
																fieldLabel : '日期',
																allowBlank : false
															}, {
																xtype : 'combogrid',
																fieldLabel : '供应商',
																name : 'supplierSupplierId',
																valueField : 'id',
																displayField : 'name',
																store : Ext.create('SupplierStore'),
																margin : 5,
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
																fieldLabel : '采购员',
																name : 'buyerSystemUserId',
																valueField : 'id',
																displayField : 'name',
																store : Ext.create('SystemUserStore'),
																margin : 5,
																matchFieldWidth : false,
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
																fieldLabel : '验收员',
																name : 'checkerSystemUserId',
																valueField : 'id',
																displayField : 'name',
																store : Ext.create('SystemUserStore'),
																margin : 5,
																matchFieldWidth : false,
																allowBlank : false,
																readOnly : true,
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
																fieldLabel : '提交人',
																name : 'submitterSystemUserId',
																valueField : 'id',
																displayField : 'name',
																store : Ext.create('SystemUserStore'),
																margin : 5,
																matchFieldWidth : false,
																readOnly : true,
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
																xtype : 'numberfield',
																hideTrigger : true,
																fieldLabel : '总金额',
																readOnly : true,
																name : 'totalsum',
																margin : 5
															}, {
																xtype : 'label'
															}, {
																xtype : 'label'
															}, {
																xtype : 'textarea',
																name : 'note',
																margin : 5,
																fieldLabel : '备注',
																maxLength : 50,
																colspan : 3,
																width : 785
															}, {
																xtype : 'textfield',
																name : 'id',
																fieldLabel : 'id',
																hidden : true
															}]
												}, {
													xtype : 'gridpanel',
													id : 'PurchaseWarehousing-edit-grid',
													region : 'center',
													store : Ext.create('PurchaseWarehousingEditEntryStore'),
													columns : [{
																xtype : 'combocolumn',
																dataIndex : 'warehouseWarehouseId',
																text : '仓库',
																gridId : 'PurchaseWarehousing-edit-grid',
																editor : {
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
															}, {
																xtype : 'combocolumn',
																dataIndex : 'materialMaterialId',
																text : '物料',
																gridId : 'PurchaseWarehousing-edit-grid',
																editor : {
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
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'materialMaterialModel',
																text : '规格型号'
															}, {
																xtype : 'numbercolumn',
																editor : {
																	xtype : 'numberfield',
																	allowBlank : false,
																	hideTrigger : true
																},
																dataIndex : 'volume',
																text : '数量',
																width : 80
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'scheduleVolume',
																text : '待验收数量',
																width : 80
															}, {
																xtype : 'combocolumn',
																dataIndex : 'unitUnitId',
																text : '单位',
																gridId : 'PurchaseWarehousing-edit-grid',
																editor : {
																	xtype : 'combobox',
																	valueField : 'id',
																	displayField : 'name',
																	store : Ext.create('UnitStore'),
																	readOnly : true
																},
																width : 80
															}, {
																xtype : 'numbercolumn',
																editor : {
																	xtype : 'numberfield',
																	allowBlank : false,
																	hideTrigger : true
																},
																dataIndex : 'price',
																text : '单价',
																width : 80
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'refPrice',
																text : '参考单价',
																width : 80
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'entrysum',
																text : '金额',
																width : 80
															}],
													viewConfig : {

													},
													plugins : [cellEditing],
													dockedItems : [{
																xtype : 'gridedittoolbar',
																dock : 'top'
															}]
												}, {
													xtype : 'container',
													height : 50,
													layout : {
														columns : 3,
														type : 'table'
													},
													region : 'south',
													items : [{
																xtype : 'datefield',
																name : 'createdStamp',
																format : 'Y-m-d H:i:s',
																readOnly : true,
																margin : 5,
																fieldLabel : '创建时间'
															}, {
																xtype : 'datefield',
																name : 'lastUpdatedStamp',
																margin : 5,
																format : 'Y-m-d H:i:s',
																readOnly : true,
																fieldLabel : '最后更新时间'
															}, {
																xtype : 'combobox',
																store : SCM.store.basiccode.billStatusStore,
																name : 'status',
																displayField : 'name',
																margin : 5,
																valueField : 'id',
																readOnly : true,
																fieldLabel : '单据状态'
															}]
												}]
									}],
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