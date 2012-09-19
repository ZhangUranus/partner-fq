/*
 * 定义物料Bom列表界面
 * Mark
 */
Ext.define('SCM.view.ProductOutwarehouse.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BillBaseToolbar', 'SCM.extend.toolbar.BillSearchToolbar'],
			alias : 'widget.ProductOutwarehouselist',
			title : '成品出仓单查询',
			layout : {
				type : 'border'
			},

			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('ProductOutwarehouseEditEntryStore', {
							id : 'ProductOutwarehouseListEntry'
						});

				Ext.applyIf(me, {
							items : [{
										xtype : 'billbasetoolbar',//工具栏
										submit : true,
										scan : true,
										region : 'north',
										border : '0 1 1 1'
									}, {
										xtype : 'gridpanel',
										margin : '0 0 0 0',
										title : '',
										region : 'center',
										store : 'ProductOutwarehouse.ProductOutwarehouseEditStore',
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
													width : 120,
													groupable : false,
													text : '提交人'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'note',
													width : 300,
													groupable : false,
													text : '备注'
												}],
										viewConfig : {

										},
										dockedItems : [{
													xtype : 'billsearchtoolbar',// 工具栏
													custType : 'warehouse',
													keyWord : true,
													border : '0 1 1 1'
												}, {
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'ProductOutwarehouse.ProductOutwarehouseEditStore',
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
													dataIndex : 'warehouseWarehouseName',
													text : '仓库'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.productInStatusRenderer,
													dataIndex : 'outwarehouseType',
													text : '出仓类型',
													width : 60
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'workshopWorkshopName',
													text : '车间'
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
													dataIndex : 'goodNumber',
													text : '货号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'destinhouseNumber',
													text : '订舱号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'containerNumber',
													text : '货柜号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'sealNumber',
													text : '封条号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'prdWeek',
													text : '生产周'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialMaterialName',
													text : '板名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialModel',
													text : '规格型号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'unitUnitName',
													text : '单位'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'qantity',
													format : '0',
													text : '板数量'
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
