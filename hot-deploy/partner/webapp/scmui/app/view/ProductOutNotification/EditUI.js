Ext.define('SCM.view.ProductOutNotification.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.ProductOutNotificationedit',
			height : 600,
			width : 830,
			title : '出货通知单',
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
										name : 'ProductOutNotificationform',
										bodyPadding : 5,
										border : 0,
										layout : 'border',
										items : [{
													xtype : 'container',
													height : 330,
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
																xtype : 'combogrid',
																fieldLabel : '客户',
																name : 'customerId',
																valueField : 'id',
																displayField : 'name',
																initStore : Ext.data.StoreManager.lookup('CComboInitStore'),
																store : Ext.data.StoreManager.lookup('CComboStore'),
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
																xtype : 'textfield',
																name : 'deliverNumber',
																margin : 5,
																fieldLabel : '单号'
															}, {
																xtype : 'textfield',
																name : 'goodNumber',
																margin : 5,
																fieldLabel : '货号'
															}, {
																xtype : 'datefield',
																name : 'planDeliveryDate',
																margin : 5,
																format : 'Y-m-d',
																fieldLabel : '计划出货时间',
																allowBlank : false
															}, {
																xtype : 'textfield',
																name : 'planHouseNumber',
																margin : 5,
																fieldLabel : '计划订舱号'
															}, {
																xtype : 'textfield',
																name : 'planContainerType',
																margin : 5,
																fieldLabel : '计划柜型'
															}, {
																xtype : 'textfield',
																name : 'inWarehouseName',
																margin : 5,
																fieldLabel : '送入仓库名称'
															}, {
																xtype : 'combogrid',
																fieldLabel : '装货仓库',
																name : 'warehouseId',
																valueField : 'id',
																displayField : 'name',
																initStore : Ext.data.StoreManager.lookup('WHComboInitStore'),
																store : Ext.data.StoreManager.lookup('WHComboStore'),
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
																xtype : 'textfield',
																name : 'carNumber',
																margin : 5,
																fieldLabel : '车牌号'
															}, {
																xtype : 'textfield',
																name : 'transferType',
																margin : 5,
																fieldLabel : '运输方式'
															}, {
																xtype : 'textfield',
																name : 'finalHouseNumber',
																margin : 5,
																fieldLabel : '实际订舱号'
															}, {
																xtype : 'textfield',
																name : 'finalContainerType',
																margin : 5,
																fieldLabel : '实际柜型'
															}, {
																xtype : 'textfield',
																name : 'finalContainerNumber',
																margin : 5,
																fieldLabel : '实际柜号'
															}, {
																xtype : 'numberfield',
																hideTrigger : true,
																fieldLabel : '货柜米数',
																name : 'containerLength',
																margin : 5
															}, {
																xtype : 'textfield',
																name : 'sealNumber',
																margin : 5,
																fieldLabel : '封条号'
															}, {
																xtype : 'datefield',
																name : 'arrivedTime',
																margin : 5,
																format: 'Y-m-d h:i', 
																fieldLabel : '到厂时间'
															}, {
																xtype : 'combobox',
																store : SCM.store.basiccode.validStore,
																name : 'packagedNotSend',
																displayField : 'name',
																margin : 5,
																valueField : 'id',
																fieldLabel : '装好未拉柜'
															}, {
																xtype : 'datefield',
																name : 'leaveTime',
																margin : 5,
																format: 'Y-m-d h:i', 
																fieldLabel : '离厂时间'
															}, {
																xtype : 'numberfield',
																hideTrigger : true,
																fieldLabel : '毛重/KG',
																name : 'grossWeight',
																margin : 5
															}, {
																xtype : 'numberfield',
																hideTrigger : true,
																fieldLabel : '皮重KG',
																name : 'tareWeight',
																margin : 5
															}, {
																xtype : 'numberfield',
																hideTrigger : true,
																fieldLabel : '净重/KG',
																name : 'neatWeight',
																margin : 5
															},  {
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
													id : 'ProductOutNotification-edit-grid',
													gridId : 'entry',
													region : 'center',
													store : Ext.create('ProductOutNotificationEditEntryStore'),
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
																editor : {
																	xtype : 'textfield'
																},
																dataIndex : 'orderNumber',
																text : '订单号'
															}, {
																xtype : 'gridcolumn',
																editor : {
																	xtype : 'textfield'
																},
																dataIndex : 'orderType',
																text : '订单类型'
															}, {
																xtype : 'gridcolumn',
																editor : {
																	xtype : 'textfield'
																},
																dataIndex : 'destinationId',
																text : '目的地代码'
															}, {
																xtype : 'datecolumn',
																editor : {
																	xtype : 'datefield',
																	margin : 5,
																	format : 'Y-m-d'
																},
																format : 'Y-m-d',
																dataIndex : 'requireReceiveDate',
																text : '客户要求收货日期'
															}, {
																xtype : 'datecolumn',
																editor : {
																	xtype : 'datefield',
																	margin : 5,
																	format : 'Y-m-d'
																},
																format : 'Y-m-d',
																dataIndex : 'orderGetDate',
																text : '订单收单日'
															}, {
																xtype : 'combocolumn',
																dataIndex : 'materialId',
																text : '产品名称',
																gridId : 'ProductOutNotification-edit-grid',
																editor : {
																	xtype : 'combogrid',
																	valueField : 'id',
																	displayField : 'name',
																	initStore : Ext.data.StoreManager.lookup('MComboInitStore'),
																	store : Ext.data.StoreManager.lookup('MComboStore'),
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
																					width : 280,
																					hideable : false
																				}]
																	}
																}
															}, {
																xtype : 'gridcolumn',
																editor : {
																	xtype : 'textfield'
																},
																dataIndex : 'regionId',
																text : '目的地'
															}, {
																xtype : 'numbercolumn',
																editor : {
																	xtype : 'numberfield',
																	hideTrigger : true
																},
																dataIndex : 'volume',
																text : '订单数量'
															}, {
																xtype : 'numbercolumn',
																editor : {
																	xtype : 'numberfield',
																	hideTrigger : true
																},
																dataIndex : 'grossWeight',
																text : '订单毛重/KG'
															}, {
																xtype : 'numbercolumn',
																editor : {
																	xtype : 'numberfield',
																	hideTrigger : true
																},
																dataIndex : 'grossSize',
																text : '订单毛体积'
															}
//															, {
//																xtype : 'numbercolumn',
//																editor : {
//																	xtype : 'numberfield',
//																	hideTrigger : true
//																},
//																dataIndex : 'sumBoardVolume',
//																text : '总托盘数量'
//															}, {
//																xtype : 'numbercolumn',
//																editor : {
//																	xtype : 'numberfield',
//																	hideTrigger : true
//																},
//																dataIndex : 'paperBoxVolume',
//																text : '纸箱数量'
//															}
															],
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