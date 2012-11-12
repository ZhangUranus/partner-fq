Ext.define('SCM.controller.ProductOutVerify.ProductOutVerifyController', {
			extend : 'Ext.app.Controller',
			mixins : [ 'SCM.extend.controller.BillCommonController'],
			views : ['ProductOutVerify.ListUI', 'ProductOutVerify.EditUI'],
			stores : ['ProductOutVerify.ProductOutVerifyEditStore', 'ProductOutVerify.ProductOutVerifyEditEntryStore', 'ProductOutVerify.DeliverNumberStore'],
			requires : ['SCM.model.ProductOutVerify.ProductOutVerifyActionModel'],
			gridTitle : '仓库调整单',
			editName : 'ProductOutVerifyedit',
			editStoreName : 'ProductOutVerifyEditStore',
			entityName : 'ProductOutVerify',
			modelName : 'ProductOutVerifyEditModel',
			entryModelName : 'ProductOutVerifyEditEntryModel',
			actionModelName : 'ProductOutVerifyActionModel',
			init : function() {
				this.control({
							'ProductOutVerifyList' : {
								afterrender : this.initComponent
							},
							// 列表事件
							'ProductOutVerifyList gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'ProductOutVerifyList button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ProductOutVerifyList button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductOutVerifyList button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表导出
							'ProductOutVerifyList button[action=export]' : {
								click : this.exportBill
							},
							// 编辑界面分录新增
							'ProductOutVerifyedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ProductOutVerifyedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面保存
							'ProductOutVerifyedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'ProductOutVerifyedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ProductOutVerifyedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'ProductOutVerifyedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'ProductOutVerifyedit grid' : {
								selectionchange : this.fieldChange
							}
						});
			},

			/**
			 * 重新方法，增加查询条件控件的引用
			 */
			afterInitComponent : function() {
				this.searchBeginDate = this.listContainer.down('datefield[name=searchBeginDate]');
				this.searchEndDate = this.listContainer.down('datefield[name=searchEndDate]');
				this.searchDeliverNum = this.listContainer.down('combogrid[name=deliverNumber]');
				this.searchMaterialId = this.listContainer.down('combogrid[name=searchMaterialId]');
				
				this.MaterialStore = Ext.data.StoreManager.lookup('MAllStore');
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				this.listPanel.store.getProxy().extraParams.bizDate=null;
				this.listPanel.store.getProxy().extraParams.deliverNum=null;
				
				
				if(this.searchBeginDate.getRawValue()){
					this.listPanel.store.getProxy().extraParams.bizBeginDate = this.searchBeginDate.getRawValue();
				}
				if(this.searchEndDate.getRawValue()){
					this.listPanel.store.getProxy().extraParams.bizEndDate = this.searchEndDate.getRawValue();
				}
				if(this.searchDeliverNum.getValue()){
					this.listPanel.store.getProxy().extraParams.deliverNum = this.searchDeliverNum.getValue();
				}
				if(this.searchMaterialId.getValue()){
					this.listPanel.store.getProxy().extraParams.searchMaterialId = this.searchMaterialId.getValue();
				}
				
				this.listPanel.store.load();
				
				this.detailPanel.store.removeAll();
				this.changeComponentsState();
			},
			
			//显示分录
			showDetail : function(me, record, index, eOpts) {
				if (record != null && record.get("deliverNumber") != null&&record.get("materialId") != null) {
					var entryStore = this.detailPanel.store;
					if (entryStore != null) {
						entryStore.clearFilter(true);
						entryStore.filter([{
									property : "deliverNumber",
									value : record.get("deliverNumber")
								},{
									property : "parentMaterialId",
									value : record.get("materialId")
								}]);
						entryStore.load();
					}
				}
				this.changeComponentsState();
			},
			
			/**
			 * 根据用户权限初始化按钮状态
			 * 
			 */
			initButtonByPermission : function() {
				if (this.listContainer.permission.edit) {
					this.editButton.setVisible(true);
				} else {
					this.editButton.setVisible(false);
				}
				if (this.listContainer.permission.remove) {
					this.deleteButton.setVisible(true);
				} else {
					this.deleteButton.setVisible(false);
				}
			},
			
			/**
			 * 点击删除按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			deleteRecord : function(button) {
				var me = this;
				record = me.getSelectRecord();
				if (record.get('status') == '4') {
					showWarning('该对数单已经存在扫描出仓板数，不允许删除！');
					return;
				}

				Ext.Msg.confirm('提示', '确定删除该' + me.gridTitle + '？', confirmChange, me);
				function confirmChange(id) {
					if (id == 'yes') {
						/* 判断是否可提交 */
						if (me.hasSubmitLock()) {
							me.getSubmitLock();//获取提交锁
							Ext.Ajax.request({
								scope : me,
								url : "../../scm/control/removeVerifyHead",
								timeout : SCM.shortTimes,
								params : {
									deliverNumber : record.get("deliverNumber"),
									materialId : record.get("materialId")
								},
								success : function(response, option) {
									if (response.responseText.length < 1) {
										showError('检查出货通知单状态出错！');
									}
									var result = Ext.decode(response.responseText)
									if (result.success) {
										showInfo('删除成功！');
									} else {
										showError('检查出货通知单状态出错！');
									}
									me.releaseSubmitLock();
								}
							});
							me.refreshRecord();
						} else {
							showWarning('上一次操作还未完成，请稍等！');
						}
					}
				}
			},
			
			/**
			 * 编辑事件
			 * 
			 * @param {}
			 *            grid 当前表格
			 * @param {}
			 *            record 选中记录
			 */
			modifyRecord : function(grid, record) {
				this.currentRecord = record;
				this.changeEditStatus(record);
				this.getEdit().uiStatus = 'Modify';
				this.editForm.getForm().loadRecord(record);
				// 根据选择的id加载编辑界面数据
				var editStore = Ext.create(this.editStoreName);
				editStore.filter([{
							property : "deliverNumber",
							value : record.get("deliverNumber")
						}, {
							property : "materialId",
							value : record.get("materialId")
						}]);
				editStore.load({
							scope : this,
							callback : function(records, operation, success) {
								//this.editForm.loadRecord(records[0]);
								var entryStore = this.editEntry.store;
								entryStore.removeAll();// 清除记录
								entryStore.clearFilter();
								entryStore.filter([{
											property : "deliverNumber",
											value : record.get("deliverNumber")
										}, {
											property : "parentMaterialId",
											value : record.get("materialId")
										}]);// 过滤记录
								entryStore.load();
								this.showEdit();
							}
						});
			},
			
			/**
			 * 根据状态设置编辑界面状态
			 * 
			 * @param {}
			 *            isReadOnly
			 */
			changeEditStatus : function(record) {
				if (record.get('status') == '0' || record.get('status') == '-1') {
					this.setFieldsReadOnly(false);
					this.editEntry.setDisabled(false);
					this.saveButton.setDisabled(false);
				} else {
					this.setFieldsReadOnly(true);
					this.editEntry.setDisabled(true);
					this.saveButton.setDisabled(true);
				}
				this.submitEditButton.setVisible(false);
				this.clearButton.setVisible(false);
			},
			
			/**
			 * 保存事件
			 * 
			 * @param {}
			 *            button 保存按钮
			 */
			saveRecord : function(button) {
				var me = this;
				var values = me.editForm.getValues();
				if (!this.isValidate()) {
					return;
				}
				
				var entryStore = me.editEntry.store;
				var record=me.editForm.getRecord();
				record.set(values);
				
				var oneEntryModel = Ext.create('ProductOutVerifyActionModel');
				oneEntryModel = processOneEntryModel(oneEntryModel, record, entryStore);
				oneEntryModel.save({
						scope:me,
					    success : function(model,reponse) {
						        showInfo('保存成功');
				 				me.refreshRecord();
				 				if (me.win.isVisible()) {
									me.win.close();
								}
						}
				});
			},
			
			// 新增分录
			addLine : function(button) {
				var entryRecord = Ext.create(this.entryModelName);
				entryRecord.phantom = true;
				// 设置父id
				entryRecord.set('deliverNumber', this.editForm.getValues().deliverNumber);
				entryRecord.set('parentMaterialId', this.editForm.getValues().materialId);
				
				entryRecord.set('sort', this.editEntry.store.getCount()+1);
				this.editEntry.store.add(entryRecord);
			},
			// 删除分录
			deleteLine : function(button) {
				this.editEntry.store.remove(this.getSelectedEntry());
			},
			
			//导出单据
			exportBill : function(button){
				if(!(this.searchBeginDate.getRawValue()&&this.searchEndDate.getRawValue())){
					showError('请输入导出日期范围');
					return ;
				}
				
				Ext.Msg.confirm('提示', '确定导出' + this.searchBeginDate.getRawValue() +'至'+this.searchEndDate.getRawValue()+ '所有记录 ？', confirmChange, this);
				function confirmChange(id) {
					if (id == 'yes') {
						window.location.href = '../scm/control/exportVerifyBill?fromDate='+this.searchBeginDate.getRawValue()+'&endDate='+this.searchEndDate.getRawValue();
						
					}
				}
			},
			getSelectedHead : function() {
				var selMod = this.listPanel.getSelectionModel();
				if (selMod != null) {
					return selMod.getLastSelected();
				}
			}
			
			
		});