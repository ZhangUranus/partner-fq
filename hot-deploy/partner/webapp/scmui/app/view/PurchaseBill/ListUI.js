/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.PurchaseBill.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BillBaseToolbar'],
			alias : 'widget.PurchaseBilllist',
			title : '采购单查询',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('PurchaseBillEditEntryStore', {
							id : 'PurchaseBillListEntry'
						});
				Ext.applyIf(me, {
							items : [{
										xtype : 'billbasetoolbar',// 工具栏
										audit : true,
										custType : 'supplier',
										region : 'north'
									}, {
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										title : '',
										region : 'center',
										store : 'PurchaseBill.PurchaseBillEditStore',
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
													dataIndex : 'supplierSupplierName',
													width : 120,
													groupable : false,
													text : '供应商'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'submitUserName',
													width : 80,
													groupable : false,
													text : '申请人'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'buyerSystemUserName',
													width : 80,
													groupable : false,
													text : '采购员'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'approverSystemUserName',
													width : 80,
													groupable : false,
													text : '审核员'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'approverNote',
													width : 80,
													groupable : false,
													text : '审核意见'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'totalsum',
													width : 80,
													groupable : false,
													text : '总金额'
												}, {
													xtype : 'datecolumn',
													dataIndex : 'receiveStamp',
													width : 140,
													format : 'Y-m-d H:i:s',
													groupable : false,
													text : '返货时间'
												}],
										viewConfig : {

										}
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
				// me.down('gridpanel').store.load();
			}
		});