Ext.define('SCM.view.PurchaseBill.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.PurchaseBilledit',
			height : 550,
			width : 815,
			title : '采购单',
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
										name : 'PurchaseBillform',
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
																initStore : Ext.data.StoreManager.lookup('SPComboInitStore'),
																store : Ext.data.StoreManager.lookup('SPComboStore'),
																margin : 5,
																matchFieldWidth : false,
																allowBlank : false,
																listConfig : {
																	width : 300,
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
																xtype : 'combogrid',
																fieldLabel : '申请人',
																name : 'submitUserId',
																valueField : 'id',
																displayField : 'name',
																initStore : Ext.data.StoreManager.lookup('SUComboInitStore'),
																store : Ext.data.StoreManager.lookup('SUComboStore'),
																margin : 5,
																matchFieldWidth : false,
																allowBlank : false,
																readOnly : true,
																hidden : true,
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
																initStore : Ext.data.StoreManager.lookup('SUComboInitStore'),
																store : Ext.data.StoreManager.lookup('SUComboStore'),
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
															},{
																xtype : 'combogrid',
																fieldLabel : '采购部门',
																readOnly : true,
																margin : 5,
																name : 'buyerDepartmentId',
																valueField : 'id',
																displayField : 'name',
																store : Ext.data.StoreManager.lookup('DepComboStore'),
																listConfig : {
																	height : SCM.DefaultSize.COMBOGRID_HEIGHT,
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
																fieldLabel : '审核员',
																name : 'approverSystemUserId',
																valueField : 'id',
																displayField : 'name',
																initStore : Ext.data.StoreManager.lookup('SUComboInitStore'),
																store : Ext.data.StoreManager.lookup('SUComboStore'),
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
																xtype : 'datefield',
																name : 'receiveStamp',
																margin : 5,
																format : 'Y-m-d H:i:s',
																fieldLabel : '返货时间',
																allowBlank : false
															}, {
																xtype : 'textfield',
																name : 'payType',
																margin : 5,
																fieldLabel : '付款方式'
															}, {
																xtype : 'textfield',
																name : 'tax',
																margin : 5,
																fieldLabel : '税金'
															}, {
																xtype : 'textfield',
																name : 'deliveryAddr',
																margin : 5,
																colspan : 2,
																width : 520,
																fieldLabel : '送货地址'
															}, {
																xtype : 'textarea',
																name : 'note',
																margin : 5,
																fieldLabel : '备注',
																maxLength : 250,
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
													id : 'PurchaseBill-edit-grid',
													region : 'center',
													store : Ext.create('PurchaseBillEditEntryStore'),
													columns : [{
																xtype : 'numbercolumn',
																dataIndex : 'sort',
																editor : {
																	xtype : 'numberfield',
																	format : '0',
																	allowBlank : false,
																	hideTrigger : true
																},
																format : '0',
																text : '序号',
																width : 40
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'materialMaterialNumber',
																text : '编号'
															}, {
																xtype : 'combocolumn',
																dataIndex : 'materialMaterialId',
																text : '物料',
																gridId : 'PurchaseBill-edit-grid',
																editor : {
																	xtype : 'combogrid',
																	valueField : 'id',
																	displayField : 'name',
																	initStore : Ext.data.StoreManager.lookup('MComboInitStore'),
																	store : Ext.data.StoreManager.lookup('MComboStore'),
																	matchFieldWidth : false,
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
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'materialMaterialModel',
																text : '规格型号'
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'materialMaterialQuality',
																text : '质量要求'
															}, {
																xtype : 'combocolumn',
																dataIndex : 'unitUnitId',
																text : '单位',
																gridId : 'PurchaseBill-edit-grid',
																editor : {
																	xtype : 'combobox',
																	valueField : 'id',
																	displayField : 'name',
																	initStore : Ext.data.StoreManager.lookup('UComboInitStore'),
																	store : Ext.data.StoreManager.lookup('UComboStore'),
																	readOnly : true
																}
															},{
																xtype : 'numbercolumn',
																editor : {
																	xtype : 'numberfield',
																	allowBlank : false,
																	hideTrigger : true
																},
																dataIndex : 'volume',
																text : '交货数量'
															},  {
																xtype : 'numbercolumn',
																editor : {
																	xtype : 'numberfield',
																	allowBlank : false,
																	hideTrigger : true
																},
																dataIndex : 'price',
																text : '单价'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'refPrice',
																text : '参考单价'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'entrysum',
																text : '金额'
															}, {
																xtype : 'datecolumn',
																editor : {
																	xtype : 'datefield',
																	format : 'Y-m-d'
																},
																format : 'Y-m-d',
																dataIndex : 'deliveryDate',
																text : '交货日期'
															}, {
																xtype : 'combocolumn',
																dataIndex : 'warehouseId',
																text : '仓库',
																gridId : 'PurchaseBill-edit-grid',
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
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'address',
																editor : {
																	xtype : 'textfield'
																},
																text : '地点'
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