/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.rpt.sdr.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.stockdetail',
			title : '库存情况',
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
													name : 'searchWarehouseId',
													width : 145,
													labelWidth : 35,
													fieldLabel : '仓库',
													store : Ext.create('WarehouseStore'),
													valueField : 'id',
													displayField : 'name',
													matchFieldWidth : false,
													emptyText : '所有仓库',
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
												}, {
													xtype : 'combogrid',
													name : 'searchMaterialId',
													width : 145,
													labelWidth : 35,
													fieldLabel : '物料',
													valueField : 'id',
													displayField : 'name',
													store : Ext.create('MaterialStore'),
													matchFieldWidth : false,
													emptyText : '所有物料',
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
												}, {
													text : '查询',
													iconCls : 'system-search',
													action : 'search'
												}, {
													text : '导出',
													iconCls : 'system-export',
													action : 'export'
												}]
									}, {
										xtype : 'panel',
										margin : '1 0 0 0',
										region : 'center',
										layout : 'fit',
										items : {
											xtype : 'chart',
											animate : true,
											shadow : true,
											store : 'rpt.StockDetailChartStore',
											legend : {
												position : 'right'
											},
											axes : [{
														type : 'Numeric',
														position : 'left',
														fields : ['ENDSUM'],
														minimum : 0,
														label : {
															renderer : Ext.util.Format.numberRenderer('0,000.00'),
															font : '12px 宋体'
														},
														grid : true,
														title : '结存金额'
													}, {
														type : 'Category',
														position : 'bottom',
														fields : ['MATERIAL_NAME'],
														label : {
															font : '12px 宋体'
														},
														title : '物料'
													}],
											series : [{
														type : 'column',
														axis : 'left',
														xField : 'MATERIAL_NAME',
														yField : ['ENDSUM'],
														title : ['结存金额'],
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
															field : ['ENDSUM'],
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
										store : 'rpt.StockDetailReportStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'WAREHOUSE_NAME',
													width : 80,
													text : '仓库'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 120,
													text : '物料名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'DEFAULT_UNIT_NAME',
													width : 50,
													text : '单位'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'BEGINVOLUME',
													width : 80,
													text : '期初数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'BEGINPRICE',
													width : 80,
													text : '期初单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'BEGINSUM',
													width : 80,
													text : '期初金额'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'INVOLUME',
													width : 80,
													text : '本期收入数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'INPRICE',
													width : 80,
													text : '本期收入单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'INSUM',
													width : 80,
													text : '本期收入金额'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'OUTVOLUME',
													width : 80,
													text : '本期发出数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'OUTPRICE',
													width : 80,
													text : '本期发出单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'OUTSUM',
													width : 80,
													text : '本期发出金额'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENDVOLUME',
													width : 80,
													text : '期末数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENDPRICE',
													width : 80,
													text : '期末单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENDSUM',
													width : 80,
													text : '期末金额'
												}],
										dockedItems : [{
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'rpt.StockDetailReportStore',
													displayInfo : true
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
