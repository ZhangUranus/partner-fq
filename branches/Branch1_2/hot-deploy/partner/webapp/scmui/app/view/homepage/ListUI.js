/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.homepage.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.homepage',
			title : '我的首页',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'panel',
										title : '物料分布情况',
										margin : '1 0 0 0',
										region : 'center',
										height : 350,
										minHeight : 220,
										layout : {
											type : 'border'
										},
										dockedItems : [{
													xtype : 'toolbar',
													height : 28,
													defaults : {
														margin : '0 3 0 0',
														xtype : 'button'
													},
													items : [{
																xtype : 'combogrid',
																margin : '0 5 0 0',
																name : 'searchMaterialId',
																width : 200,
																valueField : 'id',
																displayField : 'name',
																store : Ext.create('MaterialComboStore'),
																matchFieldWidth : false,
																emptyText : '所有物料 (取前8种物料)',
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
																xtype : 'button',
																margin : '0 10 0 0',
																text : '查询',
																iconCls : 'system-search',
																action : 'search'
															}]
												}],
										items : [{
													xtype : 'gridpanel',
													margin : '1 0 0 0',
													region : 'west',
													width : 600,
													split : true,
													store : 'homepage.HomePageVolumeDetailStore',
													columns : [{
																xtype : 'gridcolumn',
																dataIndex : 'NAME',
																width : 100,
																text : '物料'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'WH_VOLUME',
																width : 80,
																text : '仓库数量'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'WH_SUM',
																width : 80,
																text : '仓库金额'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'WS_VOLUME',
																width : 80,
																text : '车间数量'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'WS_SUM',
																width : 80,
																text : '车间金额'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'CS_VOLUME',
																width : 80,
																text : '加工商数量'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'CS_SUM',
																width : 80,
																text : '加工商金额'
															}]

												}, {
													xtype : 'panel',
													margin : '1 0 0 0',
													region : 'center',
													layout : 'fit',
													minWidth : 300,
													minHeight : 200,
													items : {
														xtype : 'chart',
														animate : true,
														shadow : true,
														store : 'homepage.HomePageVolumeChartStore',
														legend : {
															position : 'right'
														},
														axes : [{
																	type : 'Numeric',
																	position : 'left',
																	fields : ['VOLUME'],
																	minimum : 0,
																	label : {
																		renderer : Ext.util.Format.numberRenderer('0,000.00'),
																		font : '12px 宋体'
																	},
																	grid : true,
																	title : '结存数量'
																}, {
																	type : 'Category',
																	position : 'bottom',
																	fields : ['NAME'],
																	label : {
																		font : '12px 宋体'
																	},
																	title : '仓库'
																}],
														series : [{
																	type : 'column',
																	axis : 'left',
																	xField : 'NAME',
																	yField : ['VOLUME'],
																	title : ['结存数量'],
																	tips : {
																		trackMouse : true,
																		width : 140,
																		height : 28,
																		renderer : function(storeItem, item) {
																			this.setTitle(item.value[1]);
																		}
																	},
																	label : {
																		display : 'over',
																		'text-anchor' : 'middle',
																		field : ['VOLUME'],
																		renderer : Ext.util.Format.numberRenderer('0,000.00')
																	}
																}]
													}
												}]
									}, {
										xtype : 'gridpanel',
										title : '本期单据完成情况',
										margin : '1 0 0 0',
										region : 'south',
										split : true,
										height : 315,
										store : 'homepage.HomePageStatusStore',
										tools : [{
													type : 'refresh'
												}],
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MONTH',
													width : 150,
													text : '单据期间'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'NAME',
													width : 150,
													text : '单据名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'DETAIL',
													width : 500,
													text : '完成情况'
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
