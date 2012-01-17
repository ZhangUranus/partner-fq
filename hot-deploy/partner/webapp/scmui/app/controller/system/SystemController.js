Ext.define('SCM.controller.system.SystemController', {
			extend : 'Ext.app.Controller',

			views : ['system.user.ListUI'],
			stores : ['system.UserStore', 'system.SystemUserStore', 'system.RoleStore', 'system.UserTreeStore', 'system.UserOfRoleStore'],
			models : ['system.UserTreeModel'],

			/**
			 * 初始化controller
			 * 增加事件监控
			 */
			init : function() {
				this.control({
							//完成用户界面初始化后调用
							'usermanagement' : {
								afterrender : this.initComponent
							},
							//树形节点单击事件
							'usermanagement treepanel' : {
								itemclick : this.selectUserNode
							},
							//列表新增按钮
							'usermanagement button[action=addNew]' : {
								click : this.addNewRecord
							},
							//列表删除按钮
							'usermanagement button[action=delete]' : {
								click : this.deleteRecord
							},

							//编辑界面保存
							'usermanagement form button[action=save]' : {
								click : this.saveRecord
							},

							//监听各field值变动事件，只监听可见控件
							'usermanagement form textfield{isVisible()}' : {
								change : this.fieldchange
							},

							//角色列表更新事件
							'usermanagement grid' : {
								selectionchange : this.fieldchange
							}
						});
			},

			/**
			 * 页面初始化方法
			 * @param {} grid 事件触发控件
			 */
			initComponent : function(view) {
				this.selectUser = false;
				this.userView = view;
				this.userForm = view.down('form');
				this.fields = this.userForm.query("textfield{isVisible()}"); //取所以显示的field
				this.userGrid = view.down('gridpanel');
				this.userTree = view.down('treepanel');
				this.newButton = view.down('button[action=addNew]');
				this.deleteButton = view.down('button[action=delete]');
				this.saveButton = view.down('button[action=save]');
				this.userTree.store.proxy.addListener('afterRequest', this.afterRequest, this); // 监听所有请求回调
				Ext.create('SCM.store.system.UserStore').proxy.addListener('afterRequest', this.afterRequest, this); // 监听所有请求回调
				var departmentCombobox = Ext.getCmp('user-department-combobox');
				departmentCombobox.store.load();
				this.initButtonByPermission();
				this.changeComponentsState();
			},
			
			/**
			 * 捕捉提交后台的回调函数
			 * 
			 * @param {}
			 *            request.action : read,create,update,destroy
			 * @param {}
			 *            success : true,false
			 */
			afterRequest : function(request, success) {
				if (success && request.operation.success) {
					if (request.action == 'read') {
						this.initEditState();
						this.changeComponentsState();
					} else if (request.action == 'create') {
						Ext.Msg.alert("提示", "新增用户成功！", callBack);
						function callBack() {
							Ext.getCmp('user-form-layout').getLayout().setActiveItem(0);
							me.refreshTree();
						}
					} else if (request.action == 'update') {
						Ext.Msg.alert("提示", "更新用户成功！", callBack);
						function callBack() {
							Ext.getCmp('user-form-layout').getLayout().setActiveItem(0);
							me.refreshTree();
						}
					} else if (request.action == 'destroy') {
						Ext.Msg.alert("提示", "删除成功！", callBack);
						function callBack() {
							Ext.getCmp('user-form-layout').getLayout().setActiveItem(0);
							me.refreshTree();
						}
					}
				} else {
					// 不需要处理，由服务器抛出异常即可
				}
			},
			
			/**
			 * 根据用户权限初始化按钮状态
			 * 
			 */
			initButtonByPermission : function() {
				if (this.userView.permission.add) {
					this.newButton.setVisible(true);
				} else {
					this.newButton.setVisible(false);
				}

				if (this.userView.permission.remove) {
					this.deleteButton.setVisible(true);
				} else {
					this.deleteButton.setVisible(false);
				}
			},

			/**
			 * 用户操作触发改变界面控件状态
			 * 如：选中记录
			 */
			changeComponentsState : function() {
				if (this.selectUser) {
					this.deleteButton.setDisabled(false);
				} else {
					this.deleteButton.setDisabled(true);
				}
				if (this.userForm.uiStatus == 'AddNew') {
					this.saveButton.setVisible(true);
					this.userGrid.setDisabled(false);
					Ext.each(this.fields, function(item, index, length) {
								item.setReadOnly(false);
							})
				} else {
					if (this.userView.permission.edit) {
						this.saveButton.setVisible(true);
						this.userGrid.setDisabled(false);
						Ext.each(this.fields, function(item, index, length) {
									if (item.unableEdit) {
										item.setReadOnly(true);
									} else {
										item.setReadOnly(false);
									}
								})
					} else {
						this.saveButton.setVisible(false);
						this.userGrid.setDisabled(true);
						Ext.each(this.fields, function(item, index, length) {
									item.setReadOnly(true);
								})
					}
				}
			},

			/**
			 * 捕捉field控件的change事件，设置form的修改状态
			 * @param {} textField	当前控件
			 * @param {} newValue	新值
			 * @param {} oldValue	旧值
			 */
			fieldchange : function(textField, newValue, oldValue) {
				if (this.userForm.inited && !this.userForm.modifyed) {
					this.userForm.modifyed = true;
				}
				if (textField && textField.name == 'password') {//修改密码是，修改确认密码的正则表达式
					var pc = this.userForm.query("textfield[name=passwordComfirm]");
					pc[0].regex = new RegExp('^' + textField.value + '$');
					pc[0].regexText = '密码和确认密码不一致！';
					pc[0].isValid();
				}
			},

			/**
			 * 点击树形节点编辑
			 * @param {} node 选中节点
			 * @param {} record	节点数据
			 */
			selectUserNode : function(node, record) {
				var me = this;
				if (this.userForm.modifyed) {
					Ext.Msg.confirm('提示', '确定退出当前用户编辑窗口？', confirmChange);
					function confirmChange(id) {
						if (id == 'yes') {
							me.loadUserRecord(record);
						}
					}
				} else {
					me.loadUserRecord(record);
				}
				me.changeComponentsState();
			},

			loadUserRecord : function(record) {
				this.selectUser = record.get('isUser');
				if (this.selectUser) {
					this.userForm.uiStatus = 'Modify';
					this.initEditState();
					Ext.widget('userModel').self.load(record.get('id'), {
								scope : this,
								params : {
									'whereStr' : 'id =\'' + record.get('id') + '\''
								},
								success : function(record, operation) {
									this.userForm.getForm().loadRecord(record);
									this.loadGridRecord(record);
								}
							});
				}
			},

			initEditState : function() {
				this.userForm.inited = false;
				this.userForm.modifyed = false;
			},

			loadGridRecord : function(record) {
				var me = this;
				var userOfRoleStore = Ext.create('UserOfRoleStore');
				this.userGrid.store.load({
							scope : this,
							userid : record.get('userId'),
							callback : function(records, operation, success) {
								userOfRoleStore.load({
											scope : this,
											roleRecords : records,
											params : {
												'whereStr' : 'user_id =\'' + operation.userid + '\''
											},
											callback : function(records, operation, success) {
												var selectRecords = [];
												for (var i in operation.roleRecords) {
													for (var j in records) {
														if (operation.roleRecords[i].get('roleId') == records[j].get('roleId')) {
															selectRecords.push(operation.roleRecords[i]);
														}
													}
												}
												if (selectRecords.length > 0) {
													me.userGrid.getSelectionModel().select(selectRecords);
												}
												me.userForm.inited = true;
											}
										});
							}
						});
				Ext.getCmp('user-form-layout').getLayout().setActiveItem(1);
			},

			//新增
			addNewRecord : function(button) {
				this.initEditState();
				newRecord = Ext.create('SCM.model.system.UserModel');//新增记录
				if (this.userTree.getSelectionModel().getLastSelected() != null) {
					if (!this.userTree.getSelectionModel().getLastSelected().get('isUser')) {
						newRecord.set('departmentId', this.userTree.getSelectionModel().getLastSelected().get('id'));
					} else {
						newRecord.set('departmentId', this.userTree.getSelectionModel().getLastSelected().parentNode.get('id'));
					}
				}
				this.userForm.uiStatus = 'AddNew';
				this.userForm.getForm().loadRecord(newRecord);
				this.loadGridRecord(newRecord)
				this.userForm.inited = true;
				this.changeComponentsState();
			},

			//删除记录
			deleteRecord : function(button) {
				var me = this;
				sm = me.userTree.getSelectionModel();
				if (sm.hasSelection() && me.selectUser) {//判断是否选择行记录，而且选中用户节点
					//删除选择的记录
					record = sm.getLastSelected();
					Ext.Msg.confirm('提示', '确定删除【' + record.get('text') + '】用户？', confirmChange);
					function confirmChange(id) {
						if (id == 'yes') {
							var user = Ext.create('SCM.model.system.UserModel');
							user.set('id', record.get('id'));
							user.set('userId', record.get('userId'));
							user.destroy();
							Ext.Msg.alert("提示", "删除成功！", callBack);
							function callBack() {
								Ext.getCmp('user-form-layout').getLayout().setActiveItem(0);
								me.refreshTree();
							}
						}
					}
				}
			},
			//保存记录
			saveRecord : function(button) {
				var me = this;
				var values = me.userForm.getValues();
				if (!me.userForm.modifyed) {// 用户未做任何修改，直接关闭编辑框
					Ext.Msg.alert("提示信息", "未做任何修改！");
					return;
				}
				var model = null;
				if (!this.isValidate()) {
					return;
				}
				if (me.userForm.modifyed) {
					var record;
					if (me.userForm.uiStatus == 'Modify') {//修改记录
						record = me.userForm.getRecord();

					} else if (me.userForm.uiStatus == 'AddNew') {//新增记录
						record = Ext.create('SCM.model.system.UserModel');
					}
					record.set(values);
					
					var roles = me.userGrid.getSelectionModel().getSelection();
					var roleString = "";
					var uuidGenerator = new Ext.data.UuidGenerator();
					Ext.each(roles, function(item, index, length) {
							if(index != 0){
								roleString += ";"
							}
							roleString += uuidGenerator.generate();
							roleString += "#";
							roleString += item.get("roleId")
						})
					record.set("roles",roleString);
					record.save();
					Ext.Msg.alert("提示", "更新用户成功！", callBack);
					function callBack() {
						Ext.getCmp('user-form-layout').getLayout().setActiveItem(0);
						me.refreshTree();
					}
				}
			},

			/**
			 * 校验form所有field的输入值是否有效
			 * @return true 有效,false 无效
			 */
			isValidate : function() {
				var valid = true;
				Ext.each(this.fields, function(item, index, length) {
							var password = "";
							var passwordComfirm = "";
							if (item.name == 'password') {
								password = item.value;
							}
							if (item.name == 'passwordComfirm') {
								passwordComfirm = item.value;
							}
							if (!item.isValid()) {
								valid = false;
							}
						})
				return valid;
			},

			refreshTree : function() {
				this.userTree.store.load();
			}

		});