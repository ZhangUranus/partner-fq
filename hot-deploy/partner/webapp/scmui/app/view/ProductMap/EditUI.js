Ext.define('SCM.view.ProductMap.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar'],
			alias : 'widget.productmapedit',
			title : '产品资料表',
			layout : 'fit',
			width : SCM.MaxSize.WINDOW_WIDTH,
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			uiStatus : 'AddNew',
			inited : false, // 初始化标识
			modifyed : false, // 修改标识

			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										bodyPadding : '10 10 10 10',
										border : 0,
										defaults : {
											xtype : 'textfield',
											labelWidth : SCM.MaxSize.LABEL_WIDTH,
											width : SCM.MaxSize.FIELD_WIDTH
										},
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
													name : 'ikeaId',
													fieldLabel : '宜家产品编码',
													allowBlank : false,
													maxLength : 50
												}, {
													xtype : 'combogrid',
													fieldLabel : '物料名称',
													name : 'materialId',
													valueField : 'id',
													displayField : 'name',
													initStore : Ext.data.StoreManager.lookup('MComboInitStore'),
													store : Ext.data.StoreManager.lookup('MComboStore'),
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
													xtype : 'numberfield',
													name : 'boardCount',
													fieldLabel : '板数量',
													hideTrigger : true
												}, {
													xtype : 'combobox',
													name : 'packageType',
													fieldLabel : '打板类型',
													store : SCM.store.basiccode.packageTypeStore,
													displayField : 'name',
													valueField : 'id'
												}]
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