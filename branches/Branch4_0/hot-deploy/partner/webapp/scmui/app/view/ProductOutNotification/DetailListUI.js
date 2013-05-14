Ext.define('SCM.view.ProductOutNotification.DetailListUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.ProductOutNotificationdetaillist',
			height : SCM.DefaultSize.WINDOW_HEIGHT,
			width : 680,
			title : '出仓明细',
			layout : 'border',
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'gridpanel',
										id : 'ProductOutNotification-list-grid-detail',
										gridId : 'detail',
										region : 'center',
										store : Ext.create('ProductOutNotificationEntryDetailStore'),
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
													dataIndex : 'materialId',
													text : '板名称',
													gridId : 'ProductOutNotification-list-grid-detail',
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
													xtype : 'numbercolumn',
													editor : {
														xtype : 'numberfield',
														hideTrigger : true
													},
													dataIndex : 'orderQty',
													text : '计划打板数量'
												}, {
													xtype : 'numbercolumn',
													editor : {
														xtype : 'numberfield',
														hideTrigger : true
													},
													dataIndex : 'sentQty',
													text : '已出仓数量'
												}, {
													xtype : 'gridcolumn',
													editor : {
														xtype : 'textfield'
													},
													dataIndex : 'verifyContainerType',
													text : '核对柜型'
												}, {
													xtype : 'combocolumn',
													dataIndex : 'warehouseId',
													text : '出仓仓库',
													gridId : 'ProductOutNotification-list-grid-detail',
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
													dataIndex : 'isFinished',
													text : '是否完成',
													gridId : 'ProductOutNotification-list-grid-detail',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														store : SCM.store.basiccode.validStore,
														matchFieldWidth : false,
														listConfig : {
															width : 100,
															height : 100,
															columns : [{
																		header : '',
																		dataIndex : 'name',
																		width : 90,
																		hideable : false
																	}]
														}
													}
												}],
										viewConfig : {}
									}]
						});
				this.callParent(arguments);
			},
			close : function() {
				this.hide();
			}
		});