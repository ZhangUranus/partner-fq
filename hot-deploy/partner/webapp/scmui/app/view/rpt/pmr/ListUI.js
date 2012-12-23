/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.rpt.pmr.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.ux.combobox.ComboGrid'],
			alias : 'widget.purchasematchingreport',
			title : '采购供应对数表',
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
													store : Ext.data.StoreManager.lookup('MTHComboStore'),
													displayField : 'name',
													valueField : 'id',
													editable : false
												}, {
													xtype : 'combogrid',
													name : 'searchSupplierId',
													width : 155,
													labelWidth : 45,
													fieldLabel : '供应商',
													store : Ext.data.StoreManager.lookup('SPComboStore'),
													valueField : 'id',
													displayField : 'name',
													matchFieldWidth : false,
													emptyText : '所有供应商',
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
									}, 
//									{
//										xtype : 'panel',
//										margin : '1 0 0 0',
//										region : 'center',
//										layout:'fit',
//										minWidth : 300,
//										minHeight : 200,
//										items : {
//											xtype : 'chart',
//											animate : true,
//											shadow : true,
//											store : 'rpt.PurchaseMatchingChartStore',
//											legend : {
//												position : 'right'
//											},
//											axes : [{
//														type : 'Numeric',
//														position : 'left',
//														fields : ['ENTRY_SUM'],
//														minimum : 0,
//														label : {
//															renderer : Ext.util.Format.numberRenderer('0,000.00'),
//															font : '12px 宋体'
//														},
//														grid : true,
//														title : '金额'
//													}, {
//														type : 'Category',
//														position : 'bottom',
//														fields : ['SUPPLIER_NAME'],
//														label : {
//															font : '12px 宋体'
//														},
//														title : '供应商'
//													}],
//											series : [{
//														type : 'column',
//														axis : 'left',
//														xField : 'SUPPLIER_NAME',
//														yField : ['ENTRY_SUM'],
//														title : ['金额'],
//														tips : {
//															trackMouse : true,
//															width : 140,
//															height : 28,
//															renderer : function(storeItem, item) {
//																this.setTitle(item.value[1] + '元');
//															}
//														},
//														label : {
//															display : 'over',
//															'text-anchor' : 'middle',
//															field : ['ENTRY_SUM'],
//															renderer : Ext.util.Format.numberRenderer('0,000.00')
//														}
//													}]
//										}
//									}, 
									{
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										region : 'center',
										split : true,
										store : 'rpt.PurchaseMatchingReportStore',
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
													text : '供应商',
													summaryType: 'count',
													summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>汇总</b></font>';
										            }
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 120,
													text : '物料',
													summaryType: 'count',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>(' + value + ' 种物料)</b></font>';
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
													text : '单价'
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
													dataIndex : 'OUT_VOLUME',
													width : 100,
													text : '发出数量',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'BILL_ENTRY_SUM',
													width : 100,
													text : '采购金额',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'BILL_VOLUME',
													width : 100,
													text : '采购数量',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENTRY_SUM',
													width : 100,
													text : '采购单发生金额',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'VOLUME',
													width : 100,
													text : '采购单发生数量',
													summaryType: 'sum',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<font size=2 color=blue><b>' + Ext.util.Format.number(value,'0,000.0000') + '</b></font>';
										            }
												}],
										dockedItems : [{
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'rpt.PurchaseMatchingReportStore',
													displayInfo : true
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
