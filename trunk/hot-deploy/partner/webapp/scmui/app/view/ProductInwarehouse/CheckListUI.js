Ext.define('SCM.view.ProductInwarehouse.CheckListUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.ux.combobox.ComboGrid'],
			alias : 'widget.ProductInwarehousechecklist',
			height : SCM.DefaultSize.WINDOW_HEIGHT,
			width : 580,
			title : '耗料库存情况',
			layout : 'border',
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('ProductInwarehouseCheckStore');
				Ext.applyIf(me, {
							items : [{
										xtype : 'gridpanel',
										id : 'ProductInwarehouse-check-list-grid',
										region : 'center',
										border : 0,
										store : entryStore,
										columns : [{
													xtype : 'combocolumn',
													dataIndex : 'workshopId',
													text : '车间',
													gridId : 'ProductInwarehouse-check-list-grid',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														initStore : Ext.data.StoreManager.lookup('WSComboInitStore'),
														store : Ext.data.StoreManager.lookup('WSComboStore'),
														readOnly : true
													}
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'number',
													text : '物料编码'
												}, {
													xtype : 'combocolumn',
													dataIndex : 'materialId',
													text : '物料',
													gridId : 'ProductInwarehouse-check-list-grid',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														initStore : Ext.data.StoreManager.lookup('MComboInitStore'),
														store : Ext.data.StoreManager.lookup('MComboStore'),
														readOnly : true
													}
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'volume',
													text : '库存数量',
													width : 100
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'needVolume',
													text : '耗料数量',
													width : 100
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'isEnough',
													width : 60,
													text : '库存情况',
													renderer : SCM.store.basiccode.warningRenderer
												}],
										viewConfig : {}
									}, {
										xtype : 'label',
										region : 'south',
										height : 20,
										text : '该列表为车间耗料库存情况！',
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