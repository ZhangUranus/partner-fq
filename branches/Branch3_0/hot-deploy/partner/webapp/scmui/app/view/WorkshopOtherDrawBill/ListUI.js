/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.WorkshopOtherDrawBill.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BillBaseToolbar', 'SCM.extend.toolbar.BillSearchToolbar'],
			alias : 'widget.WorkshopOtherDrawBilllist',
			title : '车间其它领料查询',
			layout : {
				type : 'border'
			},

			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('WorkshopOtherDrawBillEditEntryStore', {
							id : 'WorkshopOtherDrawBillListEntry'
						});

				Ext.applyIf(me, {
							items : [{
										xtype : 'billbasetoolbar',// 工具栏
										submit : true,
										custType : 'customer',
										region : 'north'
									}, {
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										title : '',
										region : 'center',
										store : 'WorkshopOtherDrawBill.WorkshopOtherDrawBillEditStore',
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
													dataIndex : 'workshopWorkshopName',
													width : 150,
													groupable : false,
													text : '车间'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'buyerSystemUserName',
													width : 150,
													groupable : false,
													text : '领料人'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'submitterSystemUserName',
													width : 150,
													groupable : false,
													text : '提交人'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'totalsum',
													width : 150,
													groupable : false,
													text : '总金额'
												}],
										viewConfig : {},
										dockedItems : [{
													xtype : 'billsearchtoolbar',// 工具栏
													custType : 'workshop',
													keyWord : true,
													border : '0 1 1 1'
												}, {
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'WorkshopOtherDrawBill.WorkshopOtherDrawBillEditStore',
													displayInfo : true
												}]
									}// end gridpanel
									, {
										xtype : 'gridpanel',
										title : '',
										region : 'south',
										height : 150,
										split : true,
										store : entryStore,
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
													xtype : 'gridcolumn',
													dataIndex : 'parentId',
													text : 'parentId',
													hidden : true

												}, {
													xtype : 'gridcolumn',
													dataIndex : 'warehouseWarehouseName',
													text : '仓库'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialMaterialName',
													text : '物料'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialMaterialModel',
													text : '规格型号'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'volume',
													text : '数量'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'unitUnitName',
													text : '单位'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'price',
													text : '单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'entrysum',
													text : '金额'
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
