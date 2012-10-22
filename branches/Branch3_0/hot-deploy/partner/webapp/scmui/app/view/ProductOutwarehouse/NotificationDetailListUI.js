Ext.define('SCM.view.ProductOutwarehouse.NotificationDetailListUI', {
			extend : 'Ext.window.Window',
			alias : 'widget.ProductOutwarehouseNotificationDetailList',
			height : 400,
			width : 800,
			title : '出货通知单状态查询',
			layout : 'fit',
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			initComponent : function() {
				var me = this;
				var today = new Date();
				var startDay = new Date(today.getFullYear(), today.getMonth(), 1);
				Ext.applyIf(me, {
							items : [{
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										title : '',
										store : Ext.data.StoreManager.lookup('PONDetailStore'),
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'number',
													width : 140,
													text : '出货通知单编码'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'goodNumber',
													width : 80,
													text : '货号'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialName',
													width : 140,
													text : '产品名称'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialModel',
													width : 80,
													text : '规格型号'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'unitName',
													width : 40,
													text : '单位'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'orderQty',
													width : 80,
													text : '计划打板数量'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'sentQty',
													width : 80,
													text : '已出仓数量'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.validRenderer,
													dataIndex : 'isFinished',
													width : 80,
													text : '是否完成'
												}],
										viewConfig : {},
										dockedItems : [{
													xtype : 'toolbar',// 工具栏
													border : '0 1 1 1',
													height : 28,
													defaults : {
														margin : '0 3 0 0',
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
																value : startDay,
																editable : false
															}, {
																xtype : 'datefield',
																name : 'searchEndDate',
																format : 'Y-m-d',
																width : 115,
																labelWidth : 15,
																fieldLabel : '至',
																labelSeparator : '',
																value : today,
																editable : false
															}, {
																xtype : 'textfield',
																name : 'goodNumbers',
																minWidth : 200,
																emptyText : '请输入货号，多个时用,号分割'
															}, {
																text : '查询',
																iconCls : 'system-search',
																action : 'search'
															}]
												}, {
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : Ext.data.StoreManager.lookup('PONDetailStore'),
													displayInfo : true
												}]
									}]

						});

				this.callParent(arguments);
			},
			close : function() {
				this.hide();
			}
		});