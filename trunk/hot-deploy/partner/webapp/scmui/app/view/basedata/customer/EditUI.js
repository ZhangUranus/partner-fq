Ext.define('SCM.view.basedata.customer.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar'],
			alias : 'widget.customeredit',
			title : '客户',
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
													name : 'number',
													fieldLabel : '编码',
													emptyText : '保存时系统自动生成',
													readOnly : true
												}, {
													name : 'name',
													fieldLabel : '名称',
													allowBlank : false,
													maxLength : 50
												}, {
													name : 'address',
													fieldLabel : '地址',
													maxLength : 50
												}, {
													name : 'contractor',
													fieldLabel : '联系人',
													maxLength : 50
												}, {
													name : 'phone',
													fieldLabel : '电话',
													maxLength : 20
												}, {
													name : 'fax',
													fieldLabel : '传真',
													maxLength : 20
												}, {
													name : 'postCode',
													fieldLabel : '邮政编码',
													minLength : 6,
													maxLength : 6
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