/*
 * 已出仓条码查询
 */
Ext.define('SCM.view.rpt.bcq.MaterialDetailUI', {
			extend : 'Ext.container.Container',
			alias : 'widget.MaterialDetailUI',
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
													xtype : 'datefield',
													name : 'searchStartDate',
													format : 'Y-m-d',
													width : 135,
													labelWidth : 35,
													fieldLabel : '日期',
													margin : '0 0 0 0',
													value : today,
													editable : false
												},{
													xtype : 'datefield',
													name : 'searchEndDate',
													format : 'Y-m-d',
													width : 135,
													labelWidth : 35,
													fieldLabel : '到',
													margin : '0 0 0 0',
													value : today,
													editable : false
												},{
													xtype : 'textfield',
													name : 'ikeaNumber',
													minWidth : 200,
													labelWidth : 80,
													fieldLabel : '宜家产品编码'
												}, {
													xtype : 'textfield',
													name : 'materialName',
													minWidth : 180,
													labelWidth : 60,
													fieldLabel : '耗料名称'
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
										store : 'rpt.MaterialDetailQryStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												},  {
													xtype : 'gridcolumn',
													dataIndex : 'NUMBER',
													width : 100,
													text : '物料编号'
												},{
													xtype : 'gridcolumn',
													dataIndex : 'NAME',
													width : 150,
													text : '物料名称'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'VOLUME',
													width : 100,
													text : '总耗料'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'PRICE',
													width : 100,
													text : '平均单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'SUM',
													width : 100,
													text : '总金额'
												}],
										viewConfig : {

										},
										dockedItems: [{
											dock : 'bottom',
											xtype : 'pagingtoolbar',
											store : 'rpt.MaterialDetailQryStore',
											displayInfo : true
										}]
									}]
						});
				me.callParent(arguments);
			}
		});
