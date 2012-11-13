/*
 * 定义物料列表界面 Mark
 */
Ext.define('SCM.view.ProductOutVerify.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BillBaseToolbar', 'SCM.extend.toolbar.BillSearchToolbar'],
			alias : 'widget.ProductOutVerifyList',
			title : '出货对数单',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('ProductOutVerifyEditEntryStore', {
							id : 'ProductOutVerifyListEntry'
						});
				Ext.applyIf(me, {
							items : [{
										xtype : 'toolbar',// 工具栏
										region : 'north',
										border : '0 1 1 1',
										items : [{
													text : '修改',
													iconCls : 'system-edit',
													action : 'modify'
												}, {
													text : '删除',
													iconCls : 'system-delete',
													action : 'delete'
												}, {
													text : '导出对数单',
													iconCls : 'system-export',
													action : 'export'
												}]
									},{
										xtype : 'toolbar',// 工具栏
										region : 'north',
										border : '0 1 1 1',
										items : [{
													xtype : 'datefield',
													name : 'searchBeginDate',
													format : 'Y-m-d',
													width : 155,
													labelWidth : 60,
													fieldLabel : '开始日期',
													margin : '0 0 0 0'
												},{
													xtype : 'datefield',
													name : 'searchEndDate',
													format : 'Y-m-d',
													width : 155,
													labelWidth : 60,
													fieldLabel : '结束日期',
													margin : '0 0 0 0'
												},  {
													xtype : 'combogrid',
													name : 'deliverNumber',
													width : 150,
													labelWidth : 40,
													fieldLabel : '单号',
													valueField : 'number',
													displayField : 'number',
													store : Ext.create('DeliverNumberStore'),
													matchFieldWidth : false,
													listConfig : {
														width : 300,
														height : SCM.MaxSize.COMBOGRID_HEIGHT,
														columns : [{
																	header : '单号',
																	dataIndex : 'number',
																	width : 250,
																	hideable : false
																}]
													}
												},{
													xtype : 'combogrid',
													name : 'searchMaterialId',
													width : 170,
													labelWidth : 35,
													fieldLabel : '物料',
													valueField : 'id',
													displayField : 'name',
													store : Ext.data.StoreManager.lookup('MComboStore'),
													matchFieldWidth : false,
													emptyText : '所有物料',
													listConfig : {
														width : 400,
														height : SCM.MaxSize.COMBOGRID_HEIGHT,
														columns : [{
																	header : '编码',
																	dataIndex : 'number',
																	width : 100,
																	hideable : false
																}, {
																	header : '名称',
																	dataIndex : 'name',
																	width : 280,
																	hideable : false
																}]
													}
												}, {
													text : '查询',
													iconCls : 'system-search',
													action : 'search'
												}]
									}, {
										xtype : 'gridpanel',
										margin : '0 0 0 0',
										title : '',
										region : 'center',
										store : 'ProductOutVerify.ProductOutVerifyEditStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'deliverNumber',
													width : 150,
													text : '单号'
												}, {
													xtype : 'datecolumn',
													dataIndex : 'bizDate',
													width : 100,
													format : 'Y-m-d',
													text : '计划出货日期'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.billStatusRenderer,
													dataIndex : 'status',
													width : 80,
													text : '单据状态'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.validRenderer,
													dataIndex : 'isFinished',
													width : 80,
													text : '是否完成'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialName',
													width : 170,
													text : '产品名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'sumVolume',
													width : 90,
													text : '订单总数量'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'sumGrossWeight',
													width : 90,
													text : '订单总重量'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'sumGrossSize',
													width : 90,
													text : '订单总体积'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'sumBoardVolume',
													width : 90,
													text : '总托盘数量'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'paperBoxVolume',
													width : 90,
													text : '纸箱数量'
												}],
										viewConfig : {

										},
										dockedItems : [{
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'ProductOutVerify.ProductOutVerifyEditStore',
													displayInfo : true
												}]
									}, {
										xtype : 'gridpanel',
										title : '',
										region : 'south',
										height : 200,
										split : true,
										store : entryStore,
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialName',
													width : 150,
													text : '打板方式'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'orderQty',
													text : '计划打板数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'sentQty',
													text : '已出仓数量'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'warehouseName',
													text : '出仓仓库'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.validRenderer,
													dataIndex : 'isFinished',
													text : '是否完成'
												}]
									}]
						});
				me.callParent(arguments);
			}
		});