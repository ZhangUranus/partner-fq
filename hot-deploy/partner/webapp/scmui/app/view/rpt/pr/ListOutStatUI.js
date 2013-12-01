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
													width : 80,
													text : '期初数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'INVOLUME',
													width : 80,
													text : '收入数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'OUTVOLUME',
													width : 80,
													text : '发出数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENDVOLUME',
													width : 80,
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
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'datecolumn',
													dataIndex : 'PLAN_DELIVERY_DATE',
													width : 120,
													format : 'Y-m-d',
													groupable : false,
													text : '计划出货日期'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'GOOD_NUMBER',
													text : '货号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'VOLUME',
													text : '出货数量'
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
