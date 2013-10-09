Ext.define('SCM.view.rpt.psod.DetailListUI', {
			extend : 'Ext.window.Window',
			alias : 'widget.productSendOweReportDayDetailList',
			height : 700,
			width : 900,
			title : '明细情况',
			layout : {
				type : 'border'
			},
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			initComponent : function() {
				var me = this;
				var today = new Date();
				var startDay = new Date(today.getFullYear(), today.getMonth(), 1);
				Ext.applyIf(me, {
							items : [{
										xtype : 'gridpanel',
										name : 'detailGrid',
										margin : '1 0 0 0',
										title : '',
										region : 'center',
										store : 'rpt.ProductSendOweDetailReportDayStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'datecolumn',
													dataIndex : 'BIZDATE',
													width : 120,
													format : 'Y-m-d',
													text : '计划日期'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'NUMBER',
													width : 220,
													text : '出货通知单编号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'GOOD_NUMBER',
													width : 160,
													text : '货号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'PLAN_CONTAINER_TYPE',
													width : 120,
													text : '计划柜型'
												}],
										viewConfig : {},
										dockedItems : [{
													xtype : 'toolbar',// 工具栏
													border : '0 1 1 1',
													height : 28,
													defaults : {
														margin : '0 3 0 0',
														xtype : 'button'
													},
													items : [{
																xtype : 'datefield',
																name : 'searchStartDate',
																format : 'Y-m-d',
																width : 160,
																labelWidth : 60,
																fieldLabel : '计划日期',
																margin : '0 0 0 0',
																value : startDay,
																editable : false
															}, {
																xtype : 'combogrid',
																name : 'searchMaterialId',
																width : 245,
																labelWidth : 35,
																fieldLabel : '产品',
																valueField : 'id',
																displayField : 'name',
																initStore : Ext.data.StoreManager.lookup('PComboInitStore'),
																store : Ext.data.StoreManager.lookup('PComboStore'),
																matchFieldWidth : false,
																emptyText : '所有产品',
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
															}, {
																text : '查询',
																iconCls : 'system-search',
																action : 'search'
															}]
												}, {
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'rpt.ProductSendOweDetailReportDayStore',
													displayInfo : true
												}]
									}, {
										xtype : 'gridpanel',
										title : '',
										region : 'south',
										height : 300,
										split : true,
										store : 'rpt.ProductSendOweEntryReportDayStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'ORDER_NUMBER',
													width : 90,
													text : '订单号'
												}, {
													xtype : 'datecolumn',
													dataIndex : 'REQUIRE_RECEIVE_DATE',
													width : 110,
													format : 'Y-m-d',
													text : '客户要求收货日期'
												}, {
													xtype : 'datecolumn',
													dataIndex : 'ORDER_GET_DATE',
													width : 90,
													format : 'Y-m-d',
													text : '订单收单日'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 150,
													text : '产品名称'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ORDER_QTY',
													width : 100,
													text : '订单数量 (板)'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'TODAY_BAL',
													width : 100,
													text : '库存板数 (板)'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'VOLUME',
													width : 100,
													text : '计划出货套数 (套)'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'TODAY_TOTAL',
													width : 100,
													text : '总结余 (套)'
												}]
									}]

						});

				this.callParent(arguments);
			},
			close : function() {
				this.hide();
			}
		});