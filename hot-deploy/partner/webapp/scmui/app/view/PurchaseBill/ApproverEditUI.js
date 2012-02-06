Ext.define('SCM.view.PurchaseBill.ApproverEditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar'],
			alias : 'widget.purchasebillapproveredit',
			title : '采购单审批',
			layout : 'fit',
			width : SCM.DefaultSize.WINDOW_WIDTH,
			modal : true,// 背景变灰，不能编辑
			closeAction : 'hide',
			collapsible : true,
			resizable : false,

			initComponent : function() {
				var me = this;
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
													xtype : 'combobox',
													name : 'status',// 定义管理的model字段
													fieldLabel : '审核类型',
													store : SCM.store.basiccode.approverStore,
													allowBlank : false,
													editable : false,
													displayField : 'name',// 显示字段
													valueField : 'id'// 值字段，后台通过该字段传递
												}, {
													xtype : 'textarea',
													fieldLabel : '审核意见',
													name : 'approverNote',
													maxLength : 126,
													allowBlank : false
												}]
									}],
							dockedItems : [{
										xtype : 'toolbar',
										height : 28,
										defaults : {
											margin : '0 5 0 0',
											xtype : 'button'
										},
										items : ['->', {
													text : '保存',
													iconCls : 'system-save',
													action : 'save'
												}, {
													text : '取消',
													iconCls : 'system-delete',
													action : 'cancel'
												}],
										dock : 'bottom'
									}]
						});
				this.callParent();
			},

			close : function() {
				this.hide();
			}
		});