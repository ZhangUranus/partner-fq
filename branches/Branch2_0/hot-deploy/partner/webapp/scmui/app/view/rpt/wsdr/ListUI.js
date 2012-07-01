/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.rpt.wsdr.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.ux.combobox.ComboGrid'],
			alias : 'widget.workshopstockdetail',
			title : '车间储备情况',
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
											margin : '0 2 0 0',
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
													xtype : 'combogrid',
													name : 'searchWorkshopId',
													width : 145,
													labelWidth : 35,
													fieldLabel : '车间',
													store : Ext.data.StoreManager.lookup('WSComboStore'),
													valueField : 'id',
													displayField : 'name',
													matchFieldWidth : false,
													emptyText : '所有车间',
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
										store : 'rpt.WorkshopStockDetailReportStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'WORKSHOP_NAME',
													width : 150,
													text : '车间'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 250,
													text : '物料名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'DEFAULT_UNIT_NAME',
													width : 50,
													text : '单位'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'BEGINVOLUME',
													width : 90,
													text : '期初数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'BEGINPRICE',
													width : 90,
													text : '期初单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'BEGINSUM',
													width : 90,
													text : '期初金额'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENDVOLUME',
													width : 90,
													text : '期末数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENDPRICE',
													width : 90,
													text : '期末单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENDSUM',
													width : 90,
													text : '期末金额'
												}],
										dockedItems : [{
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'rpt.WorkshopStockDetailReportStore',
													displayInfo : true
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
