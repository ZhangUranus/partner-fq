Ext.define('SCM.view.ProductOutwarehouse.DetailListUI', {
			extend : 'Ext.window.Window',
			alias : 'widget.ProductOutwarehouseDetailList',
			height : 400,
			width : 700,
			title : '出仓情况查询',
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
										store : Ext.data.StoreManager.lookup('PODetailStore'),
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'goodNumber',
													text : '货号'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialName',
													text : '产品名称'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialModel',
													text : '规格型号'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'unitName',
													text : '单位'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'qantity',
													text : '板数量'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'totalVolume',
													text : '已出库数量'

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
													store : Ext.data.StoreManager.lookup('PODetailStore'),
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