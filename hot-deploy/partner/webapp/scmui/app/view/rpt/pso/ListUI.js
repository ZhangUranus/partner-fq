/*
 * 综合出货欠数表
 */
Ext.define('SCM.view.rpt.pso.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.ux.combobox.ComboGrid'],
			alias : 'widget.productsendowereport',
			title : '综合出货欠数表',
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
													xtype : 'textfield',
													name : 'week',
													width : 145,
													labelWidth : 35,
													regex:/^\d\d\d\d-\d\d?W$/,
													regexTExt:'格式:2012-12W',
													fieldLabel : '周',
													emptyText : '格式:2012-12W'
												}, {
													xtype : 'combogrid',
													name : 'searchMaterialId',
													width : 145,
													labelWidth : 35,
													fieldLabel : '物料',
													valueField : 'id',
													displayField : 'name',
													store : Ext.data.StoreManager.lookup('MComboStore'),
													matchFieldWidth : false,
													emptyText : '所有物料',
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
												},{
													xtype : 'textfield',
													name : 'blurMaterialName',
													width : 180,
													labelWidth : 60,
													fieldLabel : '物料名称'
												},{
													text : '查询',
													iconCls : 'system-search',
													action : 'search'
												}, {
													text : '导出',
													iconCls : 'system-export',
													action : 'export'
												}]
									}, {

										xtype : 'gridpanel',
										margin : '1 0 0 0',
										region : 'center',
										split : true,
										height : 300,
										store : 'rpt.ProductSendOweReportStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'WEEK',
													width : 80,
													text : '周'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 120,
													text : '产品名称'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'LAST_WEEK_BAL_QTY',
													width : 100,
													text : '上周库存板数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_WEEK_OUT_QTY',
													width : 100,
													text : '本周出货总板数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_WEEK_IN_QTY',
													width : 100,
													text : '本周进货总板数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_WEEK_CHG_QTY',
													width : 100,
													text : '本周改板总板数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_WEEK_BAL_QTY',
													width : 100,
													text : '本周库存板数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_WEEK_OWE_QTY',
													width : 100,
													text : '本周欠货情况'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'STOCKING',
													width : 100,
													text : '备货数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'STOCKINGBAL',
													width : 100,
													text : '备货余欠情况'
												}]
									}, {
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										region : 'south',
										split : true,
										height : 300,
										store : 'rpt.ProductSendOweDetailReportStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'DAY_IN_WEEK',
													width : 80,
													text : '日期'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 120,
													text : '产品名称'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_DAY_OUT_QTY',
													width : 100,
													text : '出货总板数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_DAY_IN_QTY',
													width : 100,
													text : '进货总板数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_DAY_CHG_QTY',
													width : 100,
													text : '改板总板数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_DAY_BAL_QTY',
													width : 100,
													text : '库存板数'
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
