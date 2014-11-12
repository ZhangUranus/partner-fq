Ext.define('SCM.view.tools.EntityDataUI', {
			extend : 'Ext.container.Container',
			alias : 'widget.EntityDataUI',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										bodyStyle : 'background:#ffc; padding:20px;',
										bodyPadding : 10,
										collapsible : true,
										frame : true,
										title : 'webtools',
										bodyPadding : 10,
										fieldDefaults : {
											msgTarget : 'side'
										},
										defaults : {
											anchor : '100%'
										},
										items : [{
													xtype : 'fieldset',
													title : '系统实体数据导出(所有实体)',
													collapsible : true,
													defaults : {
														margin : '0 5 0 0',
														xtype : 'textfield'
													},
													layout : 'hbox',
													items : [{
																fieldLabel : '路径',
																labelWidth : 30,
																width : 500,
																name : 'outPath',
																emptyText : '请输入文件路径，如：D:\\export，不填时默认为ofbiz根目录下export\\data。'
															}, {
																xtype : 'button',
																text : '导出',
																iconCls : 'system-export',
																action : 'export'
															}]
												}, {
													xtype : 'fieldset',
													title : '系统结算检查',
													collapsible : true,
													items : [{
																xtype : 'button',
																text : '结算',
																iconCls : 'system-search',
																action : 'settle'
															}]
												}, {
													xtype : 'fieldset',
													title : '手工进仓出仓操作',
													collapsible : true,
													items : [{
																xtype : 'button',
																text : '启动手工进仓',
																iconCls : 'system-save',
																action : 'warehouse'
															},{
																xtype : 'button',
																text : '启动手工进仓（不影响结算、耗料）',
																iconCls : 'system-save',
																action : 'warehouseWithout'
															}]
												}, {
													xtype : 'fieldset',
													title : '迁移明细数据类',
													collapsible : true,
													items : [{
																xtype : 'button',
																text : '开始',
																iconCls : 'system-save',
																action : 'write'
															}]
												}, {
													xtype : 'fieldset',
													title : '批量撤销成品出仓单',
													collapsible : true,
													items : [{
																xtype : 'button',
																text : '撤销',
																iconCls : 'system-save',
																action : 'cancelBill'
															}]
												}]
									}]
						});
				this.callParent();
			}
		});