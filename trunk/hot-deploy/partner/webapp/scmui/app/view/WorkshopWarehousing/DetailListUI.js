Ext.define('SCM.view.WorkshopWarehousing.DetailListUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.WorkshopWarehousingdetaillist',
			height : SCM.DefaultSize.WINDOW_HEIGHT,
			width : 580,
			title : '耗料明细',
			layout : 'border',
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('WorkshopWarehousingDetailStore');
				var materialStore = Ext.create('MaterialComboStore');
				materialStore.load();
				var unitStore = Ext.create('UnitStore');
				unitStore.load();
				Ext.applyIf(me, {
							items : [{
										xtype : 'gridpanel',
										id : 'WorkshopWarehousing-detail-list-grid',
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
													gridId : 'WorkshopWarehousing-detail-list-grid',
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
													gridId : 'WorkshopWarehousing-detail-list-grid',
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
									}, {
								        xtype: 'label',
										region : 'south',
										height : 20,
								        text: '该列表为单个加工件的耗料列表！',
						                style: {
								            color: 'red'
								        }
								    }]
						});
				this.callParent(arguments);
			},
			close : function() {
				this.hide();
			}
		});