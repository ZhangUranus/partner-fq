/*
 * 在库条码查询
 */
Ext.define('SCM.view.rpt.bcq.BarcodeInwarehouseUI', {
			extend : 'Ext.container.Container',
			alias : 'widget.BarcodeInwarehouseUI',
			title : '在库条码查询',
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
													width : 155,
													labelWidth : 45,
													regex:/^\d\d\d\d-\d\d?W$/,
													regexTExt:'格式:2012-12W',
													fieldLabel : '生产周',
													emptyText : '格式:2012-12W'
												}, {
													xtype : 'textfield',
													name : 'IKeaNumber',
													minWidth : 200,
													labelWidth : 80,
													fieldLabel : '宜家产品编码'
												},  {
													xtype : 'textfield',
													name : 'materialName',
													minWidth : 180,
													labelWidth : 60,
													fieldLabel : '产品名称'
												},  {
													xtype : 'textfield',
													name : 'barcode',
													minWidth : 180,
													labelWidth : 60,
													fieldLabel : '条形码'
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
										store : 'rpt.BarcodeInwarehouseQryStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'IKEA_NUMBER',
													width : 80,
													text : '宜家产品编号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 120,
													text : '产品名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'PRODUCT_WEEK',
													width : 100,
													text : '生产周期'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'PRODUCT_IN_DATE',
													width : 100,
													text : '入仓日期'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'PER_BOARD_QTY',
													width : 100,
													text : '每板数量'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'BARCODE1',
													width : 100,
													text : '条形码'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'BARCODE2',
													width : 100,
													text : '序列号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'WAREHOUSE',
													width : 100,
													text : '仓库'
												}],
										viewConfig : {

										},
										dockedItems: [{
											dock : 'bottom',
											xtype : 'pagingtoolbar',
											store : 'rpt.BarcodeInwarehouseQryStore',
											displayInfo : true
										}]
									}]
						});
				me.callParent(arguments);
			}
		});
