Ext.define('SCM.view.WorkshopWarehousing.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.WorkshopWarehousingedit',
			height : 550,
			width : 815,
			title : '制造入库单',
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
										name : 'WorkshopWarehousingform',
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
																fieldLabel : '车间',
																name : 'workshopWorkshopId',
																valueField : 'id',
																displayField : 'name',
																initStore : Ext.data.StoreManager.lookup('WSComboInitStore'),
																store : Ext.data.StoreManager.lookup('WSComboStore'),
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
																fieldLabel : '验收员',
																name : 'checkerSystemUserId',
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
															}, {
																xtype : 'combogrid',
																fieldLabel : '提交人',
																name : 'submitterSystemUserId',
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
													id : 'WorkshopWarehousing-edit-grid',
													region : 'center',
													store : Ext.create('WorkshopWarehousingEditEntryStore'),
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
																xtype : 'combocolumn',
																dataIndex : 'warehouseWarehouseId',
																text : '仓库',
																gridId : 'WorkshopWarehousing-edit-grid',
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
																xtype : 'combocolumn',
																dataIndex : 'bomId',
																text : '加工件',
																gridId : 'WorkshopWarehousing-edit-grid',
																editor : {
																	xtype : 'combogrid',
																	valueField : 'id',
																	displayField : 'materialName',
																	initStore : Ext.data.StoreManager.lookup('MBComboInitStore'),
																	store : Ext.data.StoreManager.lookup('MBComboStore'),
																	matchFieldWidth : false,
																	listConfig : {
																		width : 500,
																		height : SCM.MaxSize.COMBOGRID_HEIGHT,
																		columns : [{
																					header : '编码',
																					dataIndex : 'materialNumber',
																					width : 100,
																					hideable : false
																				}, {
																					header : '名称',
																					dataIndex : 'materialName',
																					width : 280,
																					hideable : false
																				}, {
																					header : '备注',
																					dataIndex : 'note',
																					width : 100,
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
																xtype : 'combocolumn',
																dataIndex : 'unitUnitId',
																text : '单位',
																gridId : 'WorkshopWarehousing-edit-grid',
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
																text : '注意：物料单价、金额、单据总金额在单据提交后才能显示！',
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