Ext.define('SCM.view.basedata.material.TypeEditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar', 'SCM.ux.combobox.ComboGrid'],
			alias : 'widget.materialtypeedit',
			title : '物料分类',
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
										items : [ {
													name : 'id',
													fieldLabel : 'id',
													hidden : true
												}, {
													xtype : 'combogrid',
													fieldLabel : '上级类别',
													name : 'parentId',
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
													name : 'number',
													fieldLabel : '编码',
													allowBlank : false
												}, {
													name : 'name',
													fieldLabel : '名称',
													allowBlank : false,
													maxLength : 50
												}],
										dockedItems : [{
									                    xtype: 'toolbar',
									                    dock: 'bottom',
									                    items: [
									                        {
									                            xtype: 'button',
									                            text: '保存',
									                            iconCls : 'system-save',
									                            action:'saveType'
									                        }
									                    ]
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