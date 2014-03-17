/*
 * 已出仓条码查询
 */
Ext.define('SCM.view.rpt.sdr.CurrentStockUI', {
			extend : 'Ext.container.Container',
			alias : 'widget.currentstockreport',
			title : '材料耗用汇总明细表',
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
													xtype : 'textfield',
													name : 'material',
													minWidth : 180,
													labelWidth : 60,
													fieldLabel : '物料'
												},{
													xtype : 'textfield',
													name : 'warehouse',
													minWidth : 240,
													labelWidth : 120,
													fieldLabel : '仓库/车间/客户'
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
										title : '',
										region : 'center',
										features: [{
								            id: 'group',
								            ftype: 'groupingsummary',
								            groupHeaderTpl: '{name}',
								            hideGroupedHeader: true,
								            enableGroupingMenu: false
								        }],
										store : 'rpt.CurrentStockQryStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'NUMBER',
													width : 80,
													text : '物料编码',
													summaryType: 'count',
													summaryRenderer: function(value, summaryData, dataIndex) {
														return '<p style="color:blue;font-size:12px;font-family:tahoma,arial,verdana,sans-serif">汇总</p>';
													}
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 120,
													text : '产品名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'UNIT_NAME',
													width : 80,
													text : '单位'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'HOUSE_NAME',
													width : 120,
													text : '仓储名称'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'VOLUME',
													width : 100,
													text : '仓库结存',
													summaryType: 'sum',
										            summaryRenderer: SCM.store.basiccode.sumRenderer
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'WORKSHOP_VOLUME',
													width : 100,
													text : '车间结存',
													summaryType: 'sum',
										            summaryRenderer: SCM.store.basiccode.sumRenderer
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'SUPPLIER_VOLUME',
													width : 120,
													text : '加工商结存',
													summaryType: 'sum',
										            summaryRenderer: SCM.store.basiccode.sumRenderer
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'PLAN_VOLUME',
													width : 150,
													text : '采购单未笼数量',
													summaryType: 'sum',
										            summaryRenderer: SCM.store.basiccode.sumRenderer
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'SAFE_STOCK',
													width : 150,
													text : '安全库存',
													summaryType: 'average',
										            summaryRenderer: SCM.store.basiccode.sumRenderer
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'WEEK_OUT',
													width : 150,
													text : '可供出货周数',
													summaryType: 'sum',
										            summaryRenderer: SCM.store.basiccode.sumRenderer
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'WEEK_OUT',
													width : 150,
													text : '库存情况',
													renderer : SCM.store.basiccode.safeWarningRenderer,
													summaryType: 'sum',
										            summaryRenderer: SCM.store.basiccode.safeWarningSumRenderer
												}],
										viewConfig : {

										},
										dockedItems: [{
											dock : 'bottom',
											xtype : 'pagingtoolbar',
											store : 'rpt.CurrentStockQryStore',
											displayInfo : true
										}]
									}]
						});
				me.callParent(arguments);
			}
		});
