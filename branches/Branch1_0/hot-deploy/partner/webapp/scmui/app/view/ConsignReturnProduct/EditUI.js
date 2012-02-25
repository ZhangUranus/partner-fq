Ext.define('SCM.view.ConsignReturnProduct.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.ConsignReturnProductedit',
			height : 550,
			width : 815,
			title : '委外退货单',
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
				var entryStore = Ext.create('ConsignReturnProductEditEntryStore');
				var materialBomStore = Ext.create('MaterialBomEditStore');
				materialBomStore.load();
				var unitStore = Ext.create('UnitStore');
				unitStore.load();
				var warehouseStore = Ext.create('WarehouseStore');
				warehouseStore.load();
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										name : 'ConsignReturnProductform',
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
																fieldLabel : '加工商',
																name : 'processorSupplierId',
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
																fieldLabel : '退货员',
																name : 'returnerSystemUserId',
																valueField : 'id',
																displayField : 'name',
																store : Ext.create('SystemUserStore'),
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
																fieldLabel : '验收员',
																name : 'checkerSystemUserId',
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
																xtype : 'combobox',
																store : SCM.store.basiccode.checkStatusStore,
																name : 'checkStatus',
																displayField : 'name',
																margin : 5,
																valueField : 'id',
																readOnly : true,
																fieldLabel : '验收状态'
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
													id : 'ConsignReturnProduct-edit-grid',
													region : 'center',
													store : entryStore,
													columns : [{
																xtype : 'gridcolumn',
																dataIndex : 'id',
																text : 'id',
																hidden : true
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'parentId',
																text : 'parentId',
																hidden : true
															}, {
																xtype : 'combocolumn',
																dataIndex : 'warehouseWarehouseId',
																text : '仓库',
																gridId : 'ConsignReturnProduct-edit-grid',
																editor : {
																	xtype : 'combogrid',
																	valueField : 'id',
																	displayField : 'name',
																	store : warehouseStore,
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
																text : '加工件',
																gridId : 'ConsignReturnProduct-edit-grid',
																editor : {
																	xtype : 'combogrid',
																	valueField : 'materialId',
																	displayField : 'materialName',
																	store : materialBomStore,
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
																					dataIndex : 'materialName',
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
																dataIndex : 'currentCheckVolume',
																text : '本次验收数量',
																width : 80
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'checkedVolume',
																text : '已验收数量',
																width : 80
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'volume',
																text : '退货数量',
																width : 80
															}, {
																xtype : 'combocolumn',
																dataIndex : 'unitUnitId',
																text : '单位',
																gridId : 'ConsignReturnProduct-edit-grid',
																editor : {
																	xtype : 'combobox',
																	valueField : 'id',
																	displayField : 'name',
																	store : unitStore,
																	readOnly : true
																},
																width : 80
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'price',
																text : '单价',
																width : 80
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'entrysum',
																text : '金额',
																width : 80
															}],
													viewConfig : {},
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
															}, {
																xtype : 'label',
																text : '注意：加工件单价、金额、单据总金额在单据提交后才能显示！',
																margin : 5,
																colspan : 3,
																style : {
																	'font-weight': 'bold',
																	'color': 'red',
																	'font-size':12
																}
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