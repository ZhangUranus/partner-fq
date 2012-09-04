/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.rpt.psr.ListUI', {
			extend : 'Ext.container.Container',
			alias : 'widget.productstaticsreport',
			title : '综合成品帐',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				var today = new Date();

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
													xtype : 'datefield',
													name : 'searchStartDate',
													format : 'Y-m-d',
													width : 135,
													labelWidth : 35,
													fieldLabel : '日期',
													margin : '0 0 0 0',
													value : today,
													editable : false
												}, {
													xtype : 'textfield',
													name : 'searchKeyWord',
													minWidth : 150,
													emptyText : '请输入物料名称或编码'
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
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										region : 'center',
										split : true,
										store : 'rpt.ProductStaticsReportStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 35
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'TRAD_DATE',
													width : 70,
													text : '日期'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 120,
													text : '产品名称'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'QANTITY',
													format : '0',
													width : 60,
													text : '板数量'
												}, {
													text : '上月结存',
													columns : [{
																xtype : 'numbercolumn',
																dataIndex : 'PRE_MONTH_VOLUME',
																width : 80,
																text : '板数'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'PRE_MONTH_PRODUCT_VOLUME',
																width : 80,
																text : '产品数'
															}]
												}, {
													text : '本日发生（板数）',
													columns : [{
																xtype : 'numbercolumn',
																dataIndex : 'TODAY_IN_VOLUME',
																width : 80,
																text : '入库'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'TODAY_OUT_VOLUME',
																width : 80,
																text : '出库'
															}]
												}, {
													text : '本日结存',
													columns : [{
																xtype : 'numbercolumn',
																dataIndex : 'TODAY_VOLUME',
																width : 80,
																text : '板数'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'TODAY_PRODUCT_VOLUME',
																width : 80,
																text : '产品数'
															}]
												}, {
													text : '当月累计',
													columns : [{
																xtype : 'numbercolumn',
																dataIndex : 'THIS_MONTH_IN_VOLUME',
																width : 80,
																text : '入库板数'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'THIS_MONTH_OUT_VOLUME',
																width : 80,
																text : '出库板数'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'THIS_MONTH_IN_PRODUCT_VOLUME',
																width : 80,
																text : '入库产品数'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'THIS_MONTH_OUT_PRODUCT_VOLUME',
																width : 80,
																text : '出库产品数'
															}]
												}],
										dockedItems : [{
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'rpt.ProductStaticsReportStore',
													displayInfo : true
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
