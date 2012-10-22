Ext.define('SCM.controller.ProductOutwarehouseConfirm.ProductOutwarehouseConfirmController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['ProductOutwarehouseConfirm.ListUI'],
			stores : ['ProductOutwarehouseConfirm.ProductOutwarehouseConfirmStore'],

			init : function() {
				this.control({
							'ProductOutwarehouseConfirmlist' : {
								afterrender : this.initComponent
							},
							// 列表删除按钮
							'ProductOutwarehouseConfirmlist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductOutwarehouseConfirmlist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'ProductOutwarehouseConfirmlist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表反审核按钮
							'ProductOutwarehouseConfirmlist button[action=sync]' : {
								click : this.syncBill
							}
						});
			},

			/**
			 * 初始化方法
			 */
			initComponent : function(view) {
				this.listContainer = view;
				this.listPanel = view.down('gridpanel[region=center]');
				this.searchStartDate = this.listContainer.down('datefield[name=searchStartDate]');
				this.searchEndDate = this.listContainer.down('datefield[name=searchEndDate]');
				// this.searchMaterialId =
				// this.listContainer.down('combogrid[name=searchMaterialId]');
				this.searchKeyWord = this.listPanel.down('textfield[name=searchKeyWord]');
				
				this.deleteButton = view.down('button[action=delete]');// 删除按钮
				this.submitButton = view.down('button[action=submit]');// 提交按钮
				this.searchStatus = this.listContainer.down('combobox[name=status]');
				this.searchStatus.setVisible(false);
				this.syncDownSel = this.listContainer.down('toolbar button[action=syncDownSel]');
				this.listPanel.addListener('edit', this.listPanelEditActin, this);
				this.refreshRecord();
				
				this.initButtonByPermission();
			},
			
			/**
			 * 根据用户权限初始化按钮状态
			 * 
			 */
			initButtonByPermission : function() {
				if (this.listContainer.permission.remove) {
					this.deleteButton.setVisible(true);
				} else {
					this.deleteButton.setVisible(false);
				}
				if (this.submitButton) {
					if (this.listContainer.permission.submit) {
						this.submitButton.setVisible(true);
					} else {
						this.submitButton.setVisible(false);
					}
				}
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (!Ext.isEmpty(this.searchStartDate.getValue())) {
					tempString += 'ProductOutwarehouseConfirmV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (!Ext.isEmpty(this.searchEndDate.getValue())) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ProductOutwarehouseConfirmV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				// if(this.searchMaterialId.getValue() &&
				// this.searchMaterialId.getValue() != ''){
				// if(tempString != ''){
				// tempString += ' and ';
				// }
				// tempString +=
				// 'ProductOutwarehouseConfirmV.material_material_id = \'' +
				// this.searchMaterialId.getValue() + '\'';
				// }
				if (!Ext.isEmpty(this.searchKeyWord.getValue())) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += '(materialMaterialV.name like \'%' + this.searchKeyWord.getValue() + '%\' or materialMaterialV.number like \'%' + this.searchKeyWord.getValue() + '%\')';
				}
				tempString += ' and ProductOutwarehouseConfirmV.status != \'' + 4 + '\'';

				this.listPanel.store.getProxy().extraParams.whereStr = tempString;
				this.listPanel.store.load();
			},

			/**
			 * 删除记录
			 */
			deleteRecord : function(button) {
				record = this.getSelectRecord();
				if (record.get('status') == '1' || record.get('status') == '2') {
					showWarning('单据为已审核状态，不允许删除！');
					return;
				} else if (record.get('status') == '3') {
					showWarning('单据为已结算状态，不允许删除！');
					return;
				} else if (record.get('status') == '4') {
					showWarning('单据为已提交状态，不允许删除！');
					return;
				}

				Ext.Msg.confirm('提示', '确定删除该记录？', confirmChange, this);
				function confirmChange(id) {
					if (id == 'yes') {
						this.listPanel.store.remove(record);
						this.listPanel.store.sync();
					}
				}

			},

			/**
			 * 进仓确认单列表界面编辑事件
			 */
			listPanelEditActin : function(editor, e) {
				if (this.syncDownSel.pressed == true) {
					// 从fromRow行复制值
					this.syncRecordByField(e.field, e.value, this.listPanel.store, e.rowIdx + 1);
				}
			},

			/**
			 * 从fromRow行复制值
			 * 
			 * @param {}
			 *            field
			 * @param {}
			 *            value
			 * @param {}
			 *            store
			 * @param {}
			 *            fromRow
			 */
			syncRecordByField : function(field, value, store, fromRow) {
				if (fromRow < store.getCount()) {
					var records = store.getRange(fromRow);
					Ext.Array.each(records, function(record, index, records) {
								record.set(field, value);
							});
				}
			},

			/**
			 * 返回选择所有记录
			 */
			getAllSelectRecords : function() {
				var sm = this.listPanel.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					return sm.getSelection();
				}
			},

			/**
			 * 提交单据
			 */
			submitBill : function() {
				var me = this;
				var records = me.getAllSelectRecords()
				if (records) {
					Ext.Msg.confirm('提示', '是否确定提交出仓确认单，生成成品出仓单？', submitConfirmBill, me);
					function submitConfirmBill(id) {
						if (id == 'yes') {
							var recordsData = [];
							for (var r in records) {
								recordsData.push(records[r].data);
								records[r].save(); // 保存提交的出仓单
							}
							var json = Ext.encode(recordsData);
		
							Ext.Ajax.request({
										scope : me,
										url : "../../scm/control/submitProductOutwarehouseConfirm",
										params : {
											records : json
										},
										success : function(response, option) {
											if (response.responseText.length < 1) {
												showError('系统没有返回结果');
											}
											var result = Ext.decode(response.responseText)
											if (result.success) {
												Ext.Msg.alert("提示", "提交成功！");
												me.refreshRecord();
											} else {
												showError(result.message);
											}
										}
									});
						}
					}
				} else {
					showWarning('未选中物料！');
				}

			},

			/**
			 * 同步后台记录
			 */
			syncBill : function() {
				Ext.getBody().mask('系统正在进行同步操作，请稍等....');

				Ext.Ajax.request({
							scope : this,
							timeout : 1800000,
							url : "../../scm/control/syncProductOutwarehouseConfirm",
							success : function(response, option) {
								if (response.responseText.length < 1) {
									taskMask.hide();
									showError("服务器没有回应");
								}
								var responseArray = Ext.JSON.decode(response.responseText);
								if (responseArray.success) {
									showInfo("同步完成");
									Ext.getBody().unmask();
									this.refreshRecord();
								} else {
									showError(responseArray.message);
								}
								Ext.getBody().unmask();

							},
							failure : function(response, opts) {
								showError("系统错误" + response.status);
								Ext.getBody().unmask();
							}
						});
			}
		});