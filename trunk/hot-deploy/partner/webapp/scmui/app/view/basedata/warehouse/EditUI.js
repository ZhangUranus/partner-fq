Ext.define('SCM.view.basedata.warehouse.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar'],
			alias : 'widget.warehouseedit',
			title : '仓库',
			layout : 'fit',
			width : 290,
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			uiStatus : 'AddNew',
			inited : false, // 初始化标识
			modifyed : false, // 修改标识

			initComponent : function() {
				var me = this;
				var warehouseType = Ext.create('WarehouseTypeStore');
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										bodyPadding : '5 10 10 10',
										border : 0,
										defaults : {
											xtype : 'textfield',
											labelWidth : 60,
											width : 240
										},
										items : [{
													name : 'id',
													fieldLabel : 'id',
													hidden : true
												}, {
													xtype : 'combobox',
													name : 'wsTypeId',// 定义管理的model字段
													fieldLabel : '仓库类型',
													editable : false,
													store : warehouseType,
													displayField : 'name',// 显示字段
													valueField : 'id'// 值字段，后台通过该字段传递
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