/*
 * 定义树形基础资料列表界面 Jeff
 */
Ext.define('SCM.view.system.user.ListUI', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.usermanagement',
			layout : {
				type : 'border'
			},
			title : '用户管理',
			border : false,
			initComponent : function() {
				var me = this;
				var checkBoxModel = Ext.create('Ext.selection.CheckboxModel');
				checkBoxModel.setSelectionMode('MULTI');
				Ext.applyIf(me, {
							items : [{
										region : 'center',
										id : 'user-form-layout',
										layout : 'card',
										activeItem : 0,
										defaults : {
											border : false
										},
										items : [{
													id : 'form-main',
													html : '<h1>请选择用户！</h1>'
												}, {
													xtype : 'form',
													id : 'user-form',
													bodyStyle : 'background:#ffc; padding:20px;',
													uiStatus : 'AddNew',
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
																unableEdit : true
																// 编辑状态下不可修改
														}	, {
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
																name : 'userName',
																fieldLabel : '用户名',
																allowBlank : false,
																maxLength : 32,
																unableEdit : true
																// 编辑状态下不可修改
														}	, {
																xtype : 'combobox',
																anchor : '80%',
																name : 'sex',// 定义管理的model字段
																fieldLabel : '性别',
																store : SCM.store.basiccode.sexStore,
																displayField : 'name',// 显示字段
																valueField : 'id'// 值字段，后台通过该字段传递
															}, {
																xtype : 'combobox',
																anchor : '80%',
																id : 'user-department-combobox',
																name : 'departmentId',// 定义管理的model字段
																fieldLabel : '部门编码',
																store : 'basedata.DepartmentStore',
																displayField : 'name',// 显示字段
																valueField : 'id'// 值字段，后台通过该字段传递
															}, {
																xtype : 'textfield',
																anchor : '80%',
																name : 'position',
																fieldLabel : '职位',
																maxLength : 32
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
															}, {
																xtype : 'combobox',
																anchor : '80%',
																name : 'valid',// 定义管理的model字段
																fieldLabel : '是否有效',
																store : SCM.store.basiccode.validStore,
																displayField : 'name',// 显示字段
																valueField : 'id'// 值字段，后台通过该字段传递
															}, {
																xtype : 'gridpanel',
																id : 'user-grid',
																selModel : checkBoxModel,
																store : 'system.RoleStore',
																anchor : '80% 30%',
																layout : 'column',
																frame : true,
																columns : [{
																			xtype : 'gridcolumn',
																			dataIndex : 'roleId',
																			anchor : '50%',
																			text : '角色编码'
																		}, {
																			xtype : 'gridcolumn',
																			dataIndex : 'roleName',
																			anchor : '50%',
																			text : '角色名称'
																		}]
															}]
												}]
									}, {
										region : 'west',
										xtype : 'treepanel',
										id : 'user-tree',
										width : 200,
										border : false,
										layout : 'fit',
										minSize : 130,
										maxSize : 300,
										rootVisible : false,
										autoScroll : true,
										store : 'system.UserTreeStore'
									}, {
										xtype : 'toolbar',// 工具栏
										height : 28,
										items : [{
													text : '新增',
													iconCls : 'system-add',
													action : 'addNew'
												}, {
													text : '删除',
													iconCls : 'system-delete',
													action : 'delete'
												}],
										region : 'north'
									}]
						});
				me.callParent(arguments);
			}

		});
