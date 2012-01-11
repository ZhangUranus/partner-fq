Ext.define('SCM.view.basedata.materialbom.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.ux.SelectorField', 'SCM.extend.toolbar.SaveToolbar'],
			alias : 'widget.materialbomedit',
			title : '物料BOM',
			layout : 'fit',
			height : 450,
			width : 600,
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			uiStatus : 'AddNew',
			inited : false, // 初始化标识
			modifyed : false, // 修改标识

			initComponent : function() {
				var me = this;
				var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
							clicksToEdit : 1
						});
				var entryStore = Ext.create('MaterialBomEditEntryStore');
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										name : 'materialform',
										bodyPadding : '5 10 10 10',
										layout : 'border',
										items : [{
													xtype : 'container',
													border : 0,
													defaults : {
														xtype : 'textfield',
														labelWidth : 40,
														width : 240
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
																xtype : 'selectorfield',
																storeName : 'SCM.store.basedata.MaterialStore',// 定义数据集名称
																parentFormName : 'materialbomform',
																name : 'materialId',
																margin : 5,
																fieldLabel : '物料'
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
																text : '物料id',
																hidden : true

															}, {
																xtype : 'gridcolumn',
																dataIndex : 'entryMaterialName',
																text : '物料',
																editor : {
																	xtype : 'selectorfield',
																	storeName : 'SCM.store.basedata.MaterialStore',// 定义数据集名称
																	parentFormName : 'materialbomform',
																	name : 'entryMaterialName'
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
																dataIndex : 'entryUnitId',
																text : '计量单位id',
																hidden : true

															}, {
																xtype : 'gridcolumn',
																dataIndex : 'entryUnitName',
																text : '计量单位',
																editor : {
																	xtype : 'selectorfield',
																	storeName : 'SCM.store.basedata.UnitStore',// 定义数据集名称
																	parentFormName : 'materialbomform',
																	name : 'entryUnitName'
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