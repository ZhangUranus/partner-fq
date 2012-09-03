/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.ProductOutwarehouseConfirm.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BillSearchToolbar'],
			alias : 'widget.ProductOutwarehouseConfirmlist',
			title : '成品出仓确认单',
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
													text : '向下同步选择',
													iconCls : 'syncDownSel',
													enableToggle : true,
													pressed : true,
													action : 'syncDownSel'
												}]
									}, {
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										title : '',
										region : 'center',
										multiSelect : true,
										store : 'ProductOutwarehouseConfirm.ProductOutwarehouseConfirmStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'datecolumn',
													dataIndex : 'bizDate',
													format : 'Y-m-d',
													groupable : false,
													text : '日期'
												}, {
													xtype : 'combocolumn',
													dataIndex : 'warehouseWarehouseId',
													text : '仓库',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														store : Ext.data.StoreManager.lookup('WHComboInitStore'),
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
													dataIndex : 'workshopWorkshopId',
													text : '车间',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														store : Ext.data.StoreManager.lookup('WSComboInitStore'),
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
													renderer : SCM.store.basiccode.productOutStatusRenderer,
													dataIndex : 'outwarehouseType',
													text : '出仓类型',
													editor : {
														xtype : 'combobox',
														store : SCM.store.basiccode.productOutStatusStore,
														displayField : 'name',
														valueField : 'id'
													}
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'prdWeek',
													text : '生产周'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialMaterialName',
													width : 150,
													text : '产品'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialMaterialModel',
													text : '规格型号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'unitUnitName',
													text : '单位'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'qantity',
													text : '板数量'
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
													editor : {
														xtype : 'textfield'
													},
													dataIndex : 'goodNumber',
													text : '货号'
												}, {
													xtype : 'gridcolumn',
													editor : {
														xtype : 'textfield'
													},
													dataIndex : 'destinhouseNumber',
													text : '订舱号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'submitterSystemUserName',
													text : '提交人'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.billStatusRenderer,
													dataIndex : 'status',
													text : '单据状态'
												}

										],
										viewConfig : {

										},
										plugins : [cellEditing],
										dockedItems : [{
													xtype : 'billsearchtoolbar',// 工具栏
													keyWord : true,
													border : '0 1 1 1'
												}, {
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'ProductOutwarehouseConfirm.ProductOutwarehouseConfirmStore',
													displayInfo : true
												}]
									}// end gridpanel
							]
						});
				me.callParent(arguments);

				// me.down('gridpanel').store.load();
			}
		});
