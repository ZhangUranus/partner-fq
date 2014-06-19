Ext.define('SCM.controller.ProductOutNotificationModify.ProductOutNotificationModifyController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['ProductOutNotificationModify.ListUI', 'ProductOutNotificationModify.EditUI'],
			stores : ['ProductOutNotificationModify.ProductOutNotificationModifyStore','ProductOutNotificationModify.CurDeliverNumberStore','ProductOutNotificationModify.CurGoodNumberStore','ProductOutNotificationModify.MaterialByGoodNumberStore','ProductOutNotificationModify.MaterialByDeliverNumberStore'],
			gridTitle : '出货通知单变更',
			gridName : 'ProductOutNotificationModify',
			editName : 'ProductOutNotificationModifyedit',
			modelName : 'ProductOutNotificationModifyModel',
			entityName : 'ProductOutNotificationModify',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							'ProductOutNotificationModify' : {
								afterrender : this.initComponent, // 在界面完成初始化后调用
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'ProductOutNotificationModify button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'ProductOutNotificationModify button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ProductOutNotificationModify button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'ProductOutNotificationModify button[action=search]' : {
								click : this.refreshRecord
							},
							'ProductOutNotificationModify button[action=export]' : {
								click : this.exportExcel
							},
							'ProductOutNotificationModify button[action=submit]' : {
								click : this.submitBill
							},
							// 编辑界面保存
							'ProductOutNotificationModifyedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'ProductOutNotificationModifyedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ProductOutNotificationModifyedit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'ProductOutNotificationModifyedit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'ProductOutNotificationModifyedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
			},
			
			/**
			 * 提交单据
			 * 
			 * @param {}
			 *            button
			 */
			submitBill : function(button) {
				var me = this;
				sm = this.listPanel.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					if (!me.isSubmitAble(record)) {
						return;
					}
					
					Ext.Msg.confirm('提示', '提交后将无法撤销和修改，确定提交该' + me.gridTitle + '？', confirmChange, me);
					
					function confirmChange(id) {
						Ext.getBody().mask('正在进行提交操作....');
						if (id == 'yes') {
							/* 判断是否可提交 */
							if (me.hasSubmitLock()) {
								me.getSubmitLock();//获取提交锁
								Ext.Ajax.request({
											params : {
												billId : record.get('id'),
												entity : me.entityName
											},
											url : '../../scm/control/submitNoModifyBill',
											timeout : SCM.limitTimes,
											success : function(response, option) {
												var result = Ext.decode(response.responseText)
												if (result.success) {
													Ext.Msg.alert("提示", "处理成功！");
												} else {
													showError(result.message);
												}
												Ext.getBody().unmask();
												me.refreshRecord();
												me.releaseSubmitLock();
											}
										});
							} else {
								showWarning('上一次操作还未完成，请稍等！');
							}
						} else {
							Ext.getBody().unmask();
							return false;
						}
					}
				}
			},
			
			/**
			 * 是否可以提交
			 * 
			 * @return {Boolean}
			 */
			isSubmitAble : function(record) {
				if (record.get('status') == '0' || record.get('status') == '5') {
					return true;
				} else {
					showWarning('单据已提交！');
					return false;
				}
			}
		});