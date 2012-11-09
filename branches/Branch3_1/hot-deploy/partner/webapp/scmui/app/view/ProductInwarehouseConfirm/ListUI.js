/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.ProductInwarehouseConfirm.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BillBaseToolbar', 'SCM.extend.toolbar.BillSearchToolbar'],
			alias : 'widget.ProductInwarehouseConfirmlist',
			title : '成品进仓确认单',
			layout : {
				type : 'border'
			},

			initComponent : function() {
				var me = this;
				var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1
						});

				Ext.applyIf(me, {
							items : [{
										xtype : 'toolbar',// 工具栏
										region : 'north',
										items : [{
													text : '同步',
													iconCls : 'system-refresh',
													action : 'sync'
												}, {
													text : '删除',
													iconCls : 'system-delete',
													action : 'delete'
												}, {
													text : '提交',
													iconCls : 'system-submit',
													action : 'submit'
												}, {
													text : '耗料明细',
													iconCls : 'detail',
													action : 'showDetail'
												}, {
													text : '向下同步选择',
													iconCls : 'syncDownSel',
													enableToggle : true,
													pressed : true,
													action : 'syncDownSel'
												}, {
													text : '扫描入库',
													action : 'scanIn'
												}]
									}, {
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										title : '',
										region : 'center',
										multiSelect : true,
										store : 'ProductInwarehouseConfirm.ProductInwarehouseConfirmStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'id',
													text : 'id',
													hidden : true
												}, {
													xtype : 'datecolumn',
													dataIndex : 'bizDate',
													format : 'Y-m-d',
													groupable : false,
													text : '日期',
													editor : {
														xtype : 'datefield',
														format : 'Y-m-d'
													}
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'productWeek',
													text : '生产周'
												}, {
													xtype : 'combocolumn',
													dataIndex : 'workshopWorkshopId',
													text : '车间',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														initStore : Ext.data.StoreManager.lookup('WSComboInitStore'),
														store : Ext.data.StoreManager.lookup('WSComboStore'),
														matchFieldWidth : false,
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
													}
												}, {
													xtype : 'combocolumn',
													dataIndex : 'warehouseWarehouseId',
													text : '仓库',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														initStore : Ext.data.StoreManager.lookup('WHComboInitStore'),
														store : Ext.data.StoreManager.lookup('WHComboStore'),
														matchFieldWidth : false,
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
													}
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.productInStatusRenderer,
													dataIndex : 'inwarehouseType',
													text : '进仓类型',
													editor : {
														xtype : 'combobox',
														store : SCM.store.basiccode.productInStatusStore,
														displayField : 'name',
														valueField : 'id'
													}
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialMaterialName',
													width : 150,
													text : '物料'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'volume',
													text : '数量'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'unitUnitName',
													text : '单位'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'barcode1',
													text : '产品条码'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'barcode2',
													text : '序列号'

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'submitterSystemUserName',
													text : '提交人'
												}
										],
										viewConfig : {

										},
										plugins : [cellEditing],
										dockedItems : [{
													xtype : 'billsearchtoolbar',// 工具栏
													keyWord : true,
													border : '0 1 1 1'
												}]
									}//end gridpanel
							]
						});
				me.callParent(arguments);

				//		me.down('gridpanel').store.load();
			}
		});
