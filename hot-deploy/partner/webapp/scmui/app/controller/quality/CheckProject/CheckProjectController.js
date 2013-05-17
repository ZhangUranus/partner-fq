Ext.define('SCM.controller.quality.CheckProject.CheckProjectController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['quality.CheckProject.ListUI', 'quality.CheckProject.EditUI'],
			stores : ['quality.CheckProject.CheckProjectStore'],
			gridTitle : '检验项目',
			gridName : 'checkprojectinfomaintaince',
			editName : 'checkprojectedit',
			modelName : 'CheckProjectModel',
			entityName : 'CheckProjectView',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				debugger;
				this.control({
							'checkprojectinfomaintaince' : {
								afterrender : this.initComponent, // 在界面完成初始化后调用
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'checkprojectinfomaintaince button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'checkprojectinfomaintaince button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'checkprojectinfomaintaince button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'checkprojectinfomaintaince button[action=search]' : {
								click : this.refreshRecord
							},
							'checkprojectinfomaintaince button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'checkprojectedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'checkprojectedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'checkprojectedit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'checkprojectedit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'checkprojectedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
			},
			
			/**
			 * 保存事件
			 * 
			 * @param {}
			 *            button 保存按钮
			 */
			saveRecord : function(button) {
				var values = this.editForm.getValues();
				if (!this.isValidate()) {
					return;
				}
				if (this.win.uiStatus == 'Modify' && !this.win.modifyed) {// 用户未做任何修改，直接关闭编辑框
					this.win.close();
					return;
				}
				var record;
				/* 判断是否可提交 */
				if (this.hasSubmitLock()) {
					this.getSubmitLock();//获取提交锁
					if (this.win.uiStatus == 'Modify') {// 修改记录
						var editRecord = this.editForm.getRecord();
						editRecord.set("lastUpdaterId",SCM.CurrentUser.id);
						this.editForm.getForm().updateRecord(editRecord);
					} else if (this.win.uiStatus == 'AddNew') {// 新增记录
						record = Ext.create(this.modelName);
						record.phantom = true;
						record.set(values);
						record.set("creatorId",SCM.CurrentUser.id);
						record.set("lastUpdaterId",SCM.CurrentUser.id);
						if (this.listPanel.store.indexOf(this.oldRecord) != -1) {// 避免重复添加
							this.listPanel.store.remove(this.oldRecord);
						}
						this.oldRecord = record;
						this.listPanel.store.add(record);

					}
				} else {
					showWarning('上一次操作还未完成，请稍等！');
				}
				if (this.win.isVisible()) {
					this.win.close();
				}
				this.changeComponentsState();

			}
		});