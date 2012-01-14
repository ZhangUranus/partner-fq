Ext.define('SCM.view.basedata.materialbom.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.ux.SelectorField', 'SCM.extend.toolbar.SaveToolbar', 'SCM.ux.combobox.ComboGrid'],
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
				var entryStore = Ext.create('MaterialBomEditEntryStore');
				var materialStore = Ext.create('MaterialStore');
				var unitStore = Ext.create('UnitStore');
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										name : 'materialform',
										bodyPadding : '10 10 10 10',
										layout : 'border',
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
															},

															{
																name : 'number',
																fieldLabel : '编码',
																hidden : true
															}, {
																xtype : 'combogrid',
																fieldLabel : '仓库类型',
																name : 'materialId',
																valueField : 'id',
																displayField : 'name',
																store : materialStore,
																listConfig : {
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
															}]
												}, {
													xtype : 'gridpanel',
													region : 'center',
													store : entryStore,
													columns : [{
																xtype : 'gridcolumn',
																dataIndex : 'id',
																text : 'id',
																hidden : true
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'parentId',
																text : 'parentId',
																hidden : true

															}, {
																xtype : 'gridcolumn',
																dataIndex : 'entryMaterialId',
																text : '物料编码',
																renderer : function(value) {
																	if (!Ext.isEmpty(value)) {
																		var record = materialStore.getById(value);
																		return record.get('name');
																	} else {
																		return "";
																	}
																},
																editor : {
																	xtype : 'combogrid',
																	valueField : 'id',
																	displayField : 'name',
																	store : materialStore,
																	matchFieldWidth : false,
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
																xtype : 'gridcolumn',
																name : 'unitId',
																dataIndex : 'entryUnitId',
																text : '计量单位',
																renderer : function(value) {
																	if (!Ext.isEmpty(value)) {
																		var record = unitStore.getById(value);
																		return record.get('name');
																	} else {
																		return "";
																	}
																},
																editor : {
																	xtype : 'combogrid',
																	valueField : 'id',
																	displayField : 'name',
																	store : unitStore,
																	matchFieldWidth : false,
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
																xtype : 'toolbar',
																dock : 'top',
																items : [{
																			xtype : 'button',
																			text : '分录新增',
																			action : 'addLine'
																		}, {
																			xtype : 'button',
																			text : '分录删除',
																			action : 'deleteLine'
																		}]
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