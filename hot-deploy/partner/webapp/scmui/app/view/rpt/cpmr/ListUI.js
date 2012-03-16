/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.rpt.cpmr.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.consignprocessmatchingreport',
			title : '发外加工对数表',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'toolbar',
										height : 28,
										region : 'north',
										defaults : {
											margin : '0 0 0 0',
											xtype : 'button'
										},
										items : [{
													xtype : 'combobox',
													name : 'searchMonth',
													width : 135,
													labelWidth : 35,
													fieldLabel : '月份',
													store : Ext.create('MonthStore'),
													displayField : 'name',
													valueField : 'id',
													editable : false
												}, {
													xtype : 'combogrid',
													name : 'searchSupplierId',
													width : 155,
													labelWidth : 45,
													fieldLabel : '加工商',
													store : Ext.create('SupplierStore'),
													valueField : 'id',
													displayField : 'name',
													matchFieldWidth : false,
													emptyText : '所有加工商',
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
													text : '查询',
													iconCls : 'system-search',
													action : 'search'
												}, {
													text : '导出',
													iconCls : 'system-export',
													action : 'export'
												}, {
													text : '导出明细',
													iconCls : 'system-exportDetail',
													action : 'exportDetail'
												}]
									}, {
										xtype : 'panel',
										margin : '1 0 0 0',
										region : 'center',
										layout:'fit',
										minWidth : 300,
										minHeight : 200,
										items : {
											xtype : 'chart',
											animate : true,
											shadow : true,
											store : 'rpt.ConsignProcessMatchingChartStore',
											legend : {
												position : 'right'
											},
											axes : [{
														type : 'Numeric',
														position : 'left',
														fields : ['TOTAL_IN_SUM', 'TOTAL_OUT_SUM'],
														minimum : 0,
														label : {
															renderer : Ext.util.Format.numberRenderer('0,000.00'),
															font : '12px 宋体'
														},
														grid : true,
														title : '金额'
													}, {
														type : 'Category',
														position : 'bottom',
														fields : ['SUPPLIER_NAME'],
														label : {
															font : '12px 宋体'
														},
														title : '加工商'
													}],
											series : [{
														type : 'column',
														axis : 'left',
														xField : 'SUPPLIER_NAME',
														yField : ['TOTAL_IN_SUM', 'TOTAL_OUT_SUM'],
														title : ['收入金额', '发出金额'],
														tips : {
															trackMouse : true,
															width : 140,
															height : 28,
															renderer : function(storeItem, item) {
																this.setTitle(item.value[1] + '元');
															}
														},
														label : {
															display : 'over',
															'text-anchor' : 'middle',
															field : ['TOTAL_IN_SUM', 'TOTAL_OUT_SUM'],
															renderer : Ext.util.Format.numberRenderer('0,000.00')
														}
													}]
										}
									}, {
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										region : 'south',
										split : true,
										height : 300,
										store : 'rpt.ConsignProcessMatchingReportStore',
										features: [{
									        ftype: 'summary'
									    }],
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40,
													summaryType: 'count',
													summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>99</b></font>';
										            }
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'SUPPLIER_NAME',
													width : 120,
													text : '加工商',
													summaryType: 'count',
													summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>汇总</b></font>';
										            }
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 120,
													text : '加工件',
													summaryType: 'count',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>(' + value + ' 种加工件)</b></font>';
										            }
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'DEFAULT_UNIT_NAME',
													width : 60,
													text : '单位'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'PRICE',
													width : 100,
													text : '加工单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'BEGINVOLUME',
													width : 100,
													text : '期初数量',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'IN_VOLUME',
													width : 100,
													text : '收入数量',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'IN_SUM',
													width : 100,
													text : '收入金额',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'OUT_VOLUME',
													width : 100,
													text : '发出数量',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'OUT_SUM',
													width : 100,
													text : '发出金额',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'VOLUME',
													width : 100,
													text : '结存数量',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}],
										dockedItems : [{
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'rpt.ConsignProcessMatchingReportStore',
													displayInfo : true
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
