/*
 * 综合出货欠数表(日)
 */
Ext.define('SCM.view.rpt.psod.ListUI', {
			extend : 'Ext.container.Container',
			alias : 'widget.productsendowereportday',
			title : '综合出货欠数表(日)',
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
													width : 160,
													labelWidth : 60,
													fieldLabel : '计划日期',
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
												}, {
													text : '查看明细情况',
													iconCls : 'system-search',
													action : 'querydetail'
												}]
									}, {
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										title : '',
										region : 'center',
								        viewConfig : {
								        	getRowClass: function(record, rowIndex, rowParams, store){
								        		var cls;
								        		if(!record.get('MATERIAL_ID')){
								        			cls =  'yellow-row';
								        		}
								        		return cls;
								        	}
								        },
										store : 'rpt.ProductSendOweReportDayStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'datecolumn',
													dataIndex : 'BIZDATE',
													width : 120,
													format : 'Y-m-d',
													text : '计划日期'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIAL_NAME',
													width : 220,
													text : '产品名称'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ORDER_QTY',
													width : 100,
													text : '订单数量(板)'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'TODAY_BAL',
													width : 100,
													text : '计划结存(板)'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'VOLUME',
													width : 120,
													text : '计划出货套数(套)'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'TODAY_TOTAL',
													width : 100,
													text : '总结余(套)'
												}],
										viewConfig : {
										},
										dockedItems: [{
											dock : 'bottom',
											xtype : 'pagingtoolbar',
											store : 'rpt.ProductSendOweReportDayStore',
											displayInfo : true
										}]
									}]
						});
				me.callParent(arguments);
			}
		});
