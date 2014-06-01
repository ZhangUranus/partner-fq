/*
 * 定义成品出货情况
 */
Ext.define('SCM.view.rpt.pr.ListOutStatUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.ux.combobox.ComboGrid'],
			alias : 'widget.productoutreport',
			title : '成品出货情况',
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
												}, {
													text : '导出明细',
													iconCls : 'system-exportDetail',
													action : 'exportDetail'
												}]
									}, {
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										region : 'center',
										store : 'rpt.ProductOutReportStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'NUMBER',
													width : 80,
													text : '产品编码'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 200,
													text : '产品名称'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'BEGINVOLUME',
													width : 120,
													text : '期初数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'INVOLUME',
													width : 120,
													text : '收入数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'OUTVOLUME',
													width : 150,
													text : '发出数量(保存状态)'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENDVOLUME',
													width : 120,
													text : '结存数量'
												}],
										dockedItems : [{
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'rpt.ProductOutReportStore',
													displayInfo : true
												}]
									}, {
										xtype : 'gridpanel',
										title : '',
										region : 'south',
										height : 250,
										split : true,
										store : 'rpt.ProductOutReportDetailStore',
										features: [{
									        ftype: 'summary'
									    }],
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'datecolumn',
													dataIndex : 'BIZ_DATE',
													width : 120,
													format : 'Y-m-d',
													groupable : false,
													text : '出货日期',
													summaryType: 'count',
													summaryRenderer: function(value, summaryData, dataIndex) {
														return '<p style="color:blue;font-size:12px;font-family:tahoma,arial,verdana,sans-serif">汇总</p>';
													}
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'GOOD_NUMBER',
													width : 200,
													text : '货号(成品退货单号)',
													summaryType: 'count',
										            summaryRenderer: function(value, summaryData, dataIndex) {
										                return '<p style="color:blue;font-size:12px;font-family:tahoma,arial,verdana,sans-serif">(' + value + ' 个货号)</p>';
										            }
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'VOLUME',
													text : '出货数量',
													renderer : SCM.store.basiccode.numberColorRenderer,
													summaryType: 'sum',
										            summaryRenderer: SCM.store.basiccode.sumRenderer
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
