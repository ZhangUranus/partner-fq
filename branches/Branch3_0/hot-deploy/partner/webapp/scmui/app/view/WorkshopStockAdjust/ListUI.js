/*
 * 定义物料Bom列表界面
 * Mark
 */
Ext.define('SCM.view.WorkshopStockAdjust.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BillBaseToolbar', 'SCM.extend.toolbar.BillSearchToolbar'],
			alias : 'widget.workshopstockadjustlist',
			title : '车间调整单查询',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('WorkshopStockAdjustEditEntryStore', {
							id : 'WorkshopStockAdjustListEntry'
						});
				Ext.applyIf(me, {
							items : [{
										xtype : 'billbasetoolbar',//工具栏
										submit : true,			//保留审核功能，通过权限屏蔽
										region : 'north',
										border : '0 1 1 1'
									}, {
										xtype : 'gridpanel',
										margin : '0 0 0 0',
										title : '',
										region : 'center',
										store : 'WorkshopStockAdjust.WorkshopStockAdjustEditStore',
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
												}],
										viewConfig : {

										},
										dockedItems: [{
											xtype : 'billsearchtoolbar',// 工具栏
											keyWord : true,
											border : '0 1 1 1'
										}, {
											dock : 'bottom',
											xtype : 'pagingtoolbar',
											store : 'WorkshopStockAdjust.WorkshopStockAdjustEditStore',
											displayInfo : true
										}]
									}, {
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
													dataIndex : 'workshopWorkshopName',
													text : '车间'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.billTypeRenderer,
													dataIndex : 'billType',
													text : '单据类型'
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
												}]
									}]
						});
				me.callParent(arguments);
			}
		});