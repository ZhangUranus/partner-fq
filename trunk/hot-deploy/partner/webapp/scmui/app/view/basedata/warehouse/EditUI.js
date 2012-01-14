Ext.define('SCM.view.basedata.warehouse.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.ux.combobox.ComboGrid'],
			alias : 'widget.warehouseedit',
			title : '仓库',
			layout : 'fit',
			width : SCM.DefaultSize.WINDOW_WIDTH,
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			uiStatus : 'AddNew',
			inited : false, // 初始化标识
			modifyed : false, // 修改标识

			initComponent : function() {
				var me = this;
				var warehouseType = Ext.create('WarehouseTypeStore');
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										bodyPadding : '10 10 10 10',
										border : 0,
										defaults : {
											xtype : 'textfield',
											labelWidth : SCM.DefaultSize.LABEL_WIDTH,
											width : SCM.DefaultSize.FIELD_WIDTH
										},
										items : [{
													name : 'id',
													fieldLabel : 'id',
													hidden : true
												}, {
													xtype : 'combogrid',
													fieldLabel : '仓库类型',
													name : 'wsTypeId',
													valueField : 'id',
													displayField : 'name',
													store : warehouseType,
													listConfig : {
														height : SCM.DefaultSize.COMBOGRID_HEIGHT,
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
													name : 'number',
													fieldLabel : '编码',
													hidden : true
												}, {
													name : 'name',
													fieldLabel : '名称',
													allowBlank : false,
													maxLength : 50
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