Ext.define('SCM.view.WorkshopWarehousing.DetailEditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.WorkshopWarehousingdetailedit',
			height : SCM.DefaultSize.WINDOW_HEIGHT,
			width : 550,
			title : '额外耗料明细',
			layout : 'fit',
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			uiStatus : 'AddNew',
			inited : false,
			modifyed : false,
			initComponent : function() {
				var me = this;
				var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1
						});
				var entryStore = Ext.create('WorkshopWarehousingEntryDetailStore');
				var unitStore = Ext.create('UnitStore');
				unitStore.load();
				Ext.applyIf(me, {
							items : [{
										xtype : 'gridpanel',
										id : 'WorkshopWarehousing-detail-edit-grid',
										region : 'center',
										border : 0,
										store : entryStore,
										columns : [{
													xtype : 'gridcolumn',
													dataIndex : 'id',
													text : 'id',
													hidden : true
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'entryId',
													text : 'entryId',
													hidden : true
												}, {
													xtype : 'combocolumn',
													dataIndex : 'materialMaterialId',
													text : '物料',
													gridId : 'WorkshopWarehousing-detail-edit-grid',
													editor : {
														xtype : 'combogrid',
														valueField : 'id',
														displayField : 'name',
														store : Ext.create('MaterialComboStore'),
														matchFieldWidth : false,
														listConfig : {
															width : 400,
															height : SCM.MaxSize.COMBOGRID_HEIGHT,
															columns : [{
																		header : '编码',
																		dataIndex : 'number',
																		width : 100,
																		hideable : false
																	}, {
																		header : '名称',
																		dataIndex : 'name',
																		width : 280,
																		hideable : false
																	}]
														}
													}
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialMaterialModel',
													text : '规格型号'
												}, {
													xtype : 'numbercolumn',
													editor : {
														xtype : 'numberfield',
														allowBlank : false,
														hideTrigger : true
													},
													dataIndex : 'volume',
													text : '数量',
													width : 80
												}, {
													xtype : 'combocolumn',
													dataIndex : 'unitUnitId',
													text : '单位',
													gridId : 'WorkshopWarehousing-detail-edit-grid',
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
													text : '参考单价',
													width : 80
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'entrysum',
													text : '参考金额',
													width : 80
												}],
										viewConfig : {},
										plugins : [cellEditing],
										dockedItems : [{
													xtype : 'gridedittoolbar',
													dock : 'top'
												}]
									}],
							dockedItems : [{
										xtype : 'savetoolbar',
										type : 'simple',
										dock : 'bottom'
									}]
						});
				this.callParent(arguments);
			},
			close : function() {
				this.hide();
				this.inited = false;
				this.modifyed = false;
			}
		});