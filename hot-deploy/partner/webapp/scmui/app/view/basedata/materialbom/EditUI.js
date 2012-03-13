Ext.define('SCM.view.basedata.materialbom.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.GridEditToolbar', 'SCM.extend.toolbar.SaveToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.materialbomedit',
			title : '物料BOM',
			layout : 'fit',
			width : SCM.MaxSize.WINDOW_WIDTH,
			height : SCM.MaxSize.WINDOW_HEIGHT,
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			uiStatus : 'AddNew',
			inited : false, // 初始化标识
			modifyed : false, // 修改标识

			initComponent : function() {
				var me = this;
				var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1
						});
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										name : 'materialform',
										bodyPadding : '10 10 10 10',
										layout : 'border',
										border : 0,
										items : [{
													xtype : 'container',
													border : 0,
													defaults : {
														xtype : 'textfield',
														labelWidth : SCM.MaxSize.LABEL_WIDTH,
														width : SCM.MaxSize.FIELD_WIDTH
													},
													region : 'north',
													items : [{
																name : 'id',
																fieldLabel : 'id',
																hidden : true
															}, {
																name : 'number',
																fieldLabel : '编码',
																emptyText : '保存时系统自动生成',
																readOnly : true
															}, {
																xtype : 'combogrid',
																fieldLabel : '物料名称',
																name : 'materialId',
																valueField : 'id',
																displayField : 'name',
																store : Ext.create('SCM.store.basedata.MaterialStore'),
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
															}, {
																xtype : 'combobox',
																name : 'valid',// 定义管理的model字段
																fieldLabel : '是否有效',
																store : SCM.store.basiccode.validStore,
																displayField : 'name',// 显示字段
																valueField : 'id'// 值字段，后台通过该字段传递
															}, {
																xtype : 'textarea',
																name : 'note',
																fieldLabel : '备注',
																maxLength : 50
															}]
												}, {
													xtype : 'gridpanel',
													id : 'material-bom-edit-grid',
													region : 'center',
													store : 'basedata.MaterialBomEditEntryStore',
													columns : [{
																xtype : 'combocolumn',
																dataIndex : 'entryMaterialId',
																text : '物料编码',
																gridId : 'material-bom-edit-grid',
																editor : {
																	xtype : 'combogrid',
																	valueField : 'id',
																	displayField : 'name',
																	store : Ext.create('SCM.store.basedata.MaterialStore'),
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
																xtype : 'numbercolumn',
																dataIndex : 'volume',
																text : '数量',
																editor : {
																	xtype : 'numberfield',
																	allowBlank : false,
																	hideTrigger : true

																}
															}, {
																xtype : 'combocolumn',
																name : 'unitId',
																dataIndex : 'entryUnitId',
																text : '计量单位',
																gridId : 'material-bom-edit-grid',
																editor : {
																	xtype : 'combogrid',
																	valueField : 'id',
																	displayField : 'name',
																	store : Ext.create('SCM.store.basedata.UnitStore'),
																	matchFieldWidth : false,
																	readOnly : true,
																	listConfig : {
																		width : SCM.MaxSize.COMBOGRID_WIDTH,
																		height : SCM.MaxSize.COMBOGRID_HEIGHT,
																		columns : [{
																					header : '编码',
																					dataIndex : 'number',
																					width : 100,
																					hideable : false
																				}, {
																					header : '名称',
																					dataIndex : 'name',
																					width : 80,
																					hideable : false
																				}]
																	}
																}
															}],
													viewConfig : {

													},
													plugins : [cellEditing],
													dockedItems : [{
																xtype : 'gridedittoolbar',
																dock : 'top'
															}]
												}

										]
									}],
							dockedItems : [{
										xtype : 'savetoolbar',
										dock : 'bottom'
									}]
						});
				this.callParent();
			},
			close : function() {
				this.hide();
				this.inited = false;
				this.modifyed = false;
			}
		});