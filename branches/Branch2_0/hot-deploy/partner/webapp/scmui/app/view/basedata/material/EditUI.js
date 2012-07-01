Ext.define('SCM.view.basedata.material.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.ux.combobox.ComboGrid'],
			alias : 'widget.materialedit',
			title : '物料',
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
													xtype : 'combogrid',
													fieldLabel : '物料类别',
													name : 'materialTypeId',
													valueField : 'id',
													displayField : 'name',
													store : 'basedata.MaterialTypeStore',
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
												}, {
													name : 'id',
													fieldLabel : 'id',
													hidden : true
												}, {
													name : 'number',
													fieldLabel : '编码',
													emptyText : '为空时，系统自动生成'
												}, {
													name : 'name',
													fieldLabel : '名称',
													allowBlank : false,
													maxLength : 50
												}, {
													name : 'model',
													fieldLabel : '规格型号'
												}, {
													xtype : 'numberfield',
													name : 'defaultPrice',
													hideTrigger : true,
													fieldLabel : '默认单价'
												}, {
													xtype : 'combogrid',
													fieldLabel : '默认供应商',
													name : 'defaultSupplierId',
													valueField : 'id',
													displayField : 'name',
													initStore : Ext.data.StoreManager.lookup('SPComboInitStore'),
													store : Ext.data.StoreManager.lookup('SPComboStore'),
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
												}, {
													xtype : 'numberfield',
													name : 'safeStock',
													hideTrigger : true,
													fieldLabel : '安全库存'
												}, {
													xtype : 'combogrid',
													fieldLabel : '默认计量单位',
													name : 'defaultUnitId',
													valueField : 'id',
													displayField : 'name',
													initStore : Ext.data.StoreManager.lookup('UComboInitStore'),
													store : Ext.data.StoreManager.lookup('UComboStore'),
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
												}],
										dockedItems : [{
													xtype : 'savetoolbar',
													dock : 'bottom'
												}]
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