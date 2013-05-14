/*
 * 已出仓条码查询
 */
Ext.define('SCM.view.rpt.bcq.BarcodeOutwarehouseUI', {
			extend : 'Ext.container.Container',
			alias : 'widget.BarcodeOutwarehouseUI',
			title : '已出仓条码查询',
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
												}, {
													xtype : 'textfield',
													name : 'deliveryNumber',
													minWidth : 180,
													labelWidth : 60,
													fieldLabel : '单号'
												},{
													xtype : 'textfield',
													name : 'IKeaNumber',
													minWidth : 200,
													labelWidth : 80,
													fieldLabel : '宜家产品编码'
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
										store : 'rpt.BarcodeOutwarehouseQryStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												},  {
													xtype : 'gridcolumn',
													dataIndex : 'DELIVERY_NUMBER',
													width : 80,
													text : '单号'
												},{
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
													dataIndex : 'PRODUCT_OUT_DATE',
													width : 100,
													text : '出仓日期'
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
												}],
										viewConfig : {

										},
										dockedItems: [{
											dock : 'bottom',
											xtype : 'pagingtoolbar',
											store : 'rpt.BarcodeOutwarehouseQryStore',
											displayInfo : true
										}]
									}]
						});
				me.callParent(arguments);
			}
		});
