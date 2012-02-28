/*
 * 定义树形基础资料列表界面 Jeff
 */
Ext.define('SCM.view.system.user.EditUI', {
			extend : 'Ext.form.Panel',
			alias : 'widget.userinfo',
			title : '用户资料维护',
			border : false,
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							bodyStyle : 'background:#ffc; padding:20px;',
							inited : false,
							modifyed : false,
							dockedItems : [{
										xtype : 'toolbar',
										dock : 'top',
										height : 28,
										items : [{
													text : '保存',
													iconCls : 'system-save',
													action : 'save'
												}]
									}],
							items : [{
										xtype : 'textfield',
										name : 'id',
										anchor : '80%',
										fieldLabel : 'id',
										hidden : true
									}, {
										xtype : 'textfield',
										name : 'userId',
										anchor : '80%',
										fieldLabel : '登录名',
										allowBlank : false,
										maxLength : 32,
										readOnly : true
									}, {
										xtype : 'textfield',
										anchor : '80%',
										name : 'userName',
										fieldLabel : '用户名',
										allowBlank : false,
										maxLength : 32,
										readOnly : true
									}, {
										xtype : 'textfield',
										anchor : '80%',
										name : 'password',
										fieldLabel : '密码',
										inputType : 'password',
										allowBlank : false,
										minLength : 6,
										maxLength : 46
									}, {
										xtype : 'textfield',
										anchor : '80%',
										name : 'passwordComfirm',
										fieldLabel : '确认密码',
										inputType : 'password',
										allowBlank : false,
										maxLength : 46
									}, {
										xtype : 'textfield',
										anchor : '80%',
										name : 'phoneNumber',
										fieldLabel : '手机号码',
										minLength : 11,
										maxLength : 11
									}, {
										xtype : 'textfield',
										vtype : 'email',
										anchor : '80%',
										name : 'email',
										fieldLabel : '邮箱'
									}]

						});
				me.callParent(arguments);
			}

		});
