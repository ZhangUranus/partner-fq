/*
 * 定义列表界面 Mark
 */
Ext.define('SCM.view.ProductOutNotification.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BillBaseToolbar', 'SCM.extend.toolbar.BillSearchToolbar'],
			alias : 'widget.ProductOutNotificationlist',
			title : '出货通知单查询',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('ProductOutNotificationEditEntryStore', {
							id : 'ProductOutNotificationListEntry'
						});
				var entryStoreDetail = Ext.create('ProductOutNotificationEntryDetailStore', {
							id : 'ProductOutNotificationListEntryDetail'
						});
				Ext.applyIf(me, {
							items : [{
										xtype : 'billbasetoolbar',// 工具栏
										submit : true,
										isImport : true,
										region : 'north',
										border : '0 1 1 1'
									}, {
										xtype : 'gridpanel',
										margin : '0 0 0 0',
										title : '',
										region : 'center',
										store : 'ProductOutNotification.ProductOutNotificationEditStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'number',
													width : 150,
													text : '编码'
												}, {
													xtype : 'datecolumn',
													dataIndex : 'bizDate',
													width : 120,
													format : 'Y-m-d',
													groupable : false,
													text : '业务日期'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.billStatusRenderer,
													dataIndex : 'status',
													width : 80,
													groupable : false,
													text : '单据状态'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'submitterSystemUserName',
													width : 80,
													groupable : false,
													text : '提交人'
												}
//												, {
//													xtype : 'gridcolumn',
//													renderer : SCM.store.basiccode.validRenderer,
//													dataIndex : 'isFinished',
//													width : 80,
//													groupable : false,
//													text : '是否完成'
//												}
												, {
													xtype : 'gridcolumn',
													dataIndex : 'customerName',
													width : 100,
													groupable : false,
													text : '客户名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'customerNumber',
													width : 80,
													groupable : false,
													text : '客户编号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'customerContractor',
													width : 80,
													groupable : false,
													text : '联系人'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'customerPhone',
													width : 80,
													groupable : false,
													text : '联系电话'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'customerAddress',
													width : 120,
													groupable : false,
													text : '地址'
												},{
													xtype : 'gridcolumn',
													dataIndex : 'deliverNumber',
													width : 80,
													groupable : false,
													text : '单号'
												},{
													xtype : 'gridcolumn',
													dataIndex : 'goodNumber',
													width : 80,
													groupable : false,
													text : '货号'
												}, {
													xtype : 'datecolumn',
													dataIndex : 'planDeliveryDate',
													width : 120,
													format : 'Y-m-d',
													groupable : false,
													text : '计划出货时间'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'planHouseNumber',
													width : 80,
													groupable : false,
													text : '计划订舱号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'planContainerType',
													width : 80,
													groupable : false,
													text : '计划柜型'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'inWarehouseName',
													width : 80,
													groupable : false,
													text : '送入仓库名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'warehouseName',
													width : 120,
													groupable : false,
													text : '装柜仓库'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'carNumber',
													width : 80,
													groupable : false,
													text : '车牌号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'transferType',
													width : 80,
													groupable : false,
													text : '运输方式'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'finalContainerType',
													width : 80,
													groupable : false,
													text : '实际柜型'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'containerLength',
													width : 80,
													groupable : false,
													text : '货柜米数'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'finalHouseNumber',
													width : 80,
													groupable : false,
													text : '实际订舱号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'finalContainerNumber',
													width : 80,
													groupable : false,
													text : '实际柜号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'sealNumber',
													width : 80,
													groupable : false,
													text : '封条号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'finalContainerNumber',
													width : 80,
													groupable : false,
													text : '实际柜号'
												}, {
													xtype : 'datecolumn',
													dataIndex : 'arrivedTime',
													width : 140,
													format : 'Y-m-d H:i',
													groupable : false,
													text : '到厂时间'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.validRenderer,
													dataIndex : 'packagedNotSend',
													width : 80,
													groupable : false,
													text : '装好未拉柜'
												}, {
													xtype : 'datecolumn',
													dataIndex : 'leaveTime',
													width : 140,
													format : 'Y-m-d H:i',
													groupable : false,
													text : '离厂时间'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'grossWeight',
													width : 80,
													groupable : false,
													text : '毛重/KG'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'tareWeight',
													width : 80,
													groupable : false,
													text : '皮重KG'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'neatWeight',
													width : 80,
													groupable : false,
													text : '净重/KG'
												}],
										viewConfig : {},
										dockedItems: [{
											xtype : 'billsearchtoolbar',// 工具栏
											custType : 'customer',
											border : '0 1 1 1'
										}, {
											dock : 'bottom',
											xtype : 'pagingtoolbar',
											store : 'ProductOutNotification.ProductOutNotificationEditStore',
											displayInfo : true
										}]
									}, {
										xtype : 'gridpanel',
										title : '',
										gridId : 'entry',
										region : 'south',
										height : 180,
										split : true,
										store : entryStore,
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'orderNumber',
													text : '订单号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'orderType',
													text : '订单类型'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'destinationId',
													text : '目的地代码'
												}, {
													xtype : 'datecolumn',
													dataIndex : 'requireReceiveDate',
													width : 120,
													format : 'Y-m-d',
													groupable : false,
													text : '客户要求收货日期'
												}, {
													xtype : 'datecolumn',
													dataIndex : 'orderGetDate',
													width : 120,
													format : 'Y-m-d',
													groupable : false,
													text : '订单收单日'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialName',
													text : '产品名称'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'volume',
													text : '订单数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'grossWeight',
													text : '订单毛重'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'grossSize',
													text : '订单毛体积'
												}
//												, {
//													xtype : 'numbercolumn',
//													dataIndex : 'sumBoardVolume',
//													text : '总托盘数量'
//												}, {
//													xtype : 'numbercolumn',
//													dataIndex : 'paperBoxVolume',
//													text : '纸箱数量'
//												}
												, {
													xtype : 'gridcolumn',
													dataIndex : 'regionId',
													text : '目的地'
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
