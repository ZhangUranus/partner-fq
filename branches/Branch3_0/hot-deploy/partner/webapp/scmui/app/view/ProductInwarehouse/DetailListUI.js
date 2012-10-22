Ext.define('SCM.view.ProductInwarehouse.DetailListUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.ProductInwarehousedetaillist',
			height : SCM.DefaultSize.WINDOW_HEIGHT,
			width : 750,
			title : '耗料明细',
			layout : 'border',
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('ProductInwarehouseEntryDetailStore');
				Ext.applyIf(me, {
							items : [{
										xtype : 'gridpanel',
										id : 'ProductInwarehouse-detail-list-grid',
										region : 'center',
										border : 0,
										store : entryStore,
										columns : [{
													xtype : 'gridcolumn',
													dataIndex : 'parentId',
													text : 'parentId',
													hidden : true
												}, {
													xtype : 'combocolumn',
													dataIndex : 'materialId',
													text : '物料',
													gridId : 'ProductInwarehouse-detail-list-grid',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														initStore : Ext.data.StoreManager.lookup('MComboInitStore'),
														store : Ext.data.StoreManager.lookup('MComboStore'),
														readOnly : true
													}
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'model',
													text : '规格型号'
												}, {
													xtype : 'combocolumn',
													dataIndex : 'unitUnitId',
													text : '单位',
													gridId : 'ProductInwarehouse-list-grid',
													editor : {
														xtype : 'combobox',
														valueField : 'id',
														displayField : 'name',
														initStore : Ext.data.StoreManager.lookup('UComboInitStore'),
														store : Ext.data.StoreManager.lookup('UComboStore'),
														readOnly : true
													},
													width : 80
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'quantity',
													text : '数量',
													width : 80
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'price',
													text : '单价',
													width : 80
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'amount',
													text : '金额',
													width : 80
												}],
										viewConfig : {}
									}, {
										xtype : 'label',
										region : 'south',
										height : 20,
										text : '该列表为单个成品的耗料列表！',
										style : {
											color : 'red'
										}
									}]
						});
				this.callParent(arguments);
			},
			close : function() {
				this.hide();
			}
		});