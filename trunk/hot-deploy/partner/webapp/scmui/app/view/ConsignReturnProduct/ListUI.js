/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.ConsignReturnProduct.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BillBaseToolbar', 'SCM.extend.toolbar.BillSearchToolbar'],
			alias : 'widget.ConsignReturnProductlist',
			title : '委外退货单查询',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('ConsignReturnProductEditEntryStore', {
							id : 'ConsignReturnProductListEntry'
						});
				Ext.applyIf(me, {
							items : [{
										xtype : 'billbasetoolbar',// 工具栏
										submit : true,
										region : 'north',
										border : '0 1 1 1'
									}, {
										xtype : 'gridpanel',
										margin : '0 0 0 0',
										title : '',
										region : 'center',
										store : 'ConsignReturnProduct.ConsignReturnProductEditStore',
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
													dataIndex : 'processorSupplierName',
													width : 150,
													groupable : false,
													text : '加工商'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'returnerSystemUserName',
													width : 80,
													groupable : false,
													text : '退货员'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'checkerSystemUserName',
													width : 80,
													groupable : false,
													text : '验收员'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.checkStatusRenderer,
													dataIndex : 'checkStatus',
													width : 80,
													groupable : false,
													text : '验收状态'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'submitterSystemUserName',
													width : 80,
													groupable : false,
													text : '提交人'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'totalsum',
													width : 100,
													groupable : false,
													text : '总金额'
												}],
										viewConfig : {},
										dockedItems: [{
											xtype : 'billsearchtoolbar',// 工具栏
											custType : 'processor',
											border : '0 1 1 1'
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
													dataIndex : 'materialMaterialName',
													text : '加工件'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialMaterialModel',
													text : '规格型号'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'currentCheckVolume',
													text : '本次验收数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'checkedVolume',
													text : '已验收数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'volume',
													text : '退货数量'
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
				// me.down('gridpanel').store.load();
			}
		});
