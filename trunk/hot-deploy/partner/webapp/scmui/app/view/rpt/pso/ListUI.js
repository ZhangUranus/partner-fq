/*
 * 综合出货欠数表
 */
Ext.define('SCM.view.rpt.pso.ListUI', {
			extend : 'Ext.container.Container',
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
													regex:/^\d\d\d\d-\d\dW$/,
													regexTExt:'格式:2012-01W',
													fieldLabel : '周',
													emptyText : '格式:2012-01W'
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
										title : '',
										region : 'center',
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
													dataIndex : 'LAST_WEEK_OWE_QTY',
													width : 100,
													text : '上周库存板数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_WEEK_OUT_QTY',
													width : 100,
													hidden:true,
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
													dataIndex : 'THIS_WEEK_PLN_QTY',
													width : 110,
													text : '本周计划出仓板数'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'THIS_WEEK_OWE_QTY',
													width : 100,
													renderer : SCM.store.basiccode.numberColorRenderer,
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
												}],
										viewConfig : {

										},
										dockedItems: [{
											dock : 'bottom',
											xtype : 'pagingtoolbar',
											store : 'rpt.ProductSendOweReportStore',
											displayInfo : true
										}]
									}, {
										xtype : 'gridpanel',
										title : '',
										region : 'south',
										height : 300,
										split : true,
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
													hidden:true,
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
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_DAY_PLN_QTY',
													width : 100,
													text : '计划出仓板数'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'THIS_DAY_OWE_QTY',
													width : 100,
													text : '欠货情况'
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
