/*
 * 定义列表界面 Mark
 */
Ext.define('SCM.view.ProductOutVerify.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BillBaseToolbar', 'SCM.extend.toolbar.BillSearchToolbar','SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.ProductOutVerifyList',
			title : '出货对数单',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				});
				var cellEditing2 = Ext.create('Ext.grid.plugin.CellEditing', {
					clicksToEdit : 1
				});
				Ext.applyIf(me, {
							items : [{
										xtype : 'toolbar',// 工具栏
										region : 'north',
										items : [{
													text : '保存',
													iconCls : 'system-save',
													action : 'save'
												}, {
													text : '提交',
													iconCls : 'system-submit',
													action : 'submit'
												}, {
													text : '撤销',
													iconCls : 'system-rollback',
													action : 'rollback'
												}, {
													text : '导出整张出货单',
													iconCls : 'system-export',
													action : 'export'
												},{
													xtype : 'datefield',
													name : 'searchDate',
													format : 'Y-m-d',
													width : 135,
													labelWidth : 35,
													fieldLabel : '日期',
													margin : '0 0 0 0'
												},{
													xtype : 'combogrid',
													name : 'deliverNumber',
													width : 200,
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
													text : '查询',
													iconCls : 'system-search',
													action : 'search'
												}]
									}, {
										xtype : 'gridpanel',
										margin : '0 0 0 0',
										title : '',
										region : 'center',
										store : 'ProductOutVerify.ProductOutVerifyHeadStore',
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
													groupable : false,
													text : '业务日期'
												},{
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
													editor : {
														xtype : 'numberfield',
														format : '0',
														allowBlank : false,
														hideTrigger : true
													},
													width : 90,
													text : '总托盘数量'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'paperBoxVolume',
													editor : {
														xtype : 'numberfield',
														format : '0',
														allowBlank : false,
														hideTrigger : true
													},
													width : 90,
													text : '纸箱数量'
												},{
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.billStatusRenderer,
													dataIndex : 'status',
													width : 80,
													groupable : false,
													text : '状态'
												}],
										plugins : [cellEditing],
										viewConfig : {}
									}
									, {
										xtype : 'gridpanel',
										title : '',
										gridId : 'detail',
										region : 'south',
										height : 300,
										split : true,
										store :  'ProductOutVerify.ProductOutVerifyEntryStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'combocolumn',
													dataIndex : 'materialId',
													gridId : 'ProductOutVerifyList-detail-grid',
													width : 200,
													text : '打板方式',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														initStore : Ext.data.StoreManager.lookup('MComboInitStore'),
														store : Ext.data.StoreManager.lookup('MComboStore'),
														matchFieldWidth : false,
														listConfig : {
															width : 300,
															height : SCM.MaxSize.COMBOGRID_HEIGHT,
															columns : [{
																		header : '编码',
																		dataIndex : 'number',
																		width : 80,
																		hideable : false
																	}, {
																		header : '名称',
																		dataIndex : 'name',
																		width : 200,
																		hideable : false
																	}]
														}
													}
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'orderQty',
													editor : {
														xtype : 'numberfield',
														format : '0',
														allowBlank : false,
														hideTrigger : true
													},
													width : 120,
													text : '计划打板数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'sentQty',
													width : 120,
													text : '已出仓数量'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'warehouseName',
													width : 120,
													text : '出仓仓库'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.validRenderer,
													dataIndex : 'isFinished',
													width : 80,
													groupable : false,
													text : '是否完成'
												}],
												plugins : [cellEditing2],
												dockedItems : [{
													xtype : 'toolbar',// 工具栏
													region : 'north',
													items : [{
																text : '分录新增',
																iconCls : 'bill-addline',
																action : 'addLine'
															}, {
																text : '分录删除',
																iconCls : 'bill-dline',
																action : 'deleteLine'
															}]
												}]
									}
									
							]
						});
				me.callParent(arguments);
			}
		});
