Ext.define('SCM.view.ConsignWarehousing.DetailListUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.ConsignWarehousingdetaillist',
			height : SCM.DefaultSize.WINDOW_HEIGHT,
			width : 550,
			title : '耗料明细',
			layout : 'fit',
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('ConsignWarehousingDetailStore');
				var materialStore = Ext.create('MaterialStore');
				materialStore.load();
				var unitStore = Ext.create('UnitStore');
				unitStore.load();
				Ext.applyIf(me, {
							items : [{
										xtype : 'gridpanel',
										id : 'ConsignWarehousing-detail-list-grid',
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
													gridId : 'ConsignWarehousing-detail-list-grid',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														store : materialStore,
														readOnly : true
													}
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialModel',
													text : '规格型号'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'volume',
													text : '数量',
													width : 80
												}, {
													xtype : 'combocolumn',
													dataIndex : 'materialUnitId',
													text : '单位',
													gridId : 'ConsignReturnProduct-edit-grid',
													editor : {
														xtype : 'combobox',
														valueField : 'id',
														displayField : 'name',
														store : unitStore,
														readOnly : true
													},
													width : 80
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'price',
													text : '单价',
													width : 80
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'entrysum',
													text : '金额',
													width : 80
												}],
										viewConfig : {}
									}]
						});
				this.callParent(arguments);
			},
			close : function() {
				this.hide();
			}
		});