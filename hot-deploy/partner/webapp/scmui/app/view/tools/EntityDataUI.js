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
												}]
									}]
						});
				this.callParent();
			}
		});