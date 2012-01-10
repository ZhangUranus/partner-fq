Ext.define('SCM.view.basedata.customer.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar'],
			alias : 'widget.customeredit',
			title : '客户',
			layout : 'fit',
			width : 300,
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			uiStatus : 'AddNew',
			inited : false, // 初始化标识
			modifyed : false, // 修改标识

			initComponent : function() {
				var me = this;
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
													name : 'number',
													fieldLabel : '编码',
													hidden : true
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