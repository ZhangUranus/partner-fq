Ext.define('SCM.controller.ProductOutNotification.ProductOutNotificationController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ProductOutNotification.ListUI', 'ProductOutNotification.EditUI', 'ProductOutNotification.DetailListUI', 'ProductOutNotification.DetailEditUI'],
			stores : ['ProductOutNotification.ProductOutNotificationStore', 'ProductOutNotification.ProductOutNotificationEditStore', 'ProductOutNotification.ProductOutNotificationEditEntryStore', 'ProductOutNotification.ProductOutNotificationEntryDetailStore'],
			requires : ['SCM.model.ProductOutNotification.ProductOutNotificationActionModel'],
			gridTitle : '出货通知单',
			editName : 'ProductOutNotificationedit',
			editStoreName : 'ProductOutNotificationEditStore',
			entityName : 'ProductOutNotification',
			modelName : 'ProductOutNotificationEditModel',
			entryModelName : 'ProductOutNotificationEditEntryModel',
			actionModelName : 'ProductOutNotificationActionModel',
			init : function() {
				this.control({
							'ProductOutNotificationlist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'ProductOutNotificationlist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'ProductOutNotificationlist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 分录列表事件
							'ProductOutNotificationlist gridpanel[gridId=entry]' : {
								select : this.showEntryDetail
							},
							// 列表修改按钮
							'ProductOutNotificationlist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ProductOutNotificationlist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductOutNotificationlist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表提交按钮
							'ProductOutNotificationlist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'ProductOutNotificationlist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'ProductOutNotificationlist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'ProductOutNotificationlist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'ProductOutNotificationedit gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ProductOutNotificationedit gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},
							// 查看分录耗料明细
							'ProductOutNotificationedit gridpanel button[action=viewDetail]' : {
								click : this.viewDetailList
							},
							// 编辑界面分录额外耗料明细
							'ProductOutNotificationedit gridpanel button[action=editDetail]' : {
								click : this.editDetailRecord
							},
							// 编辑界面分录明细新增
							'ProductOutNotificationdetailedit gridpanel button[action=addLine]' : {
								click : this.addDetailLine
							},
							// 编辑界面分录明细删除
							'ProductOutNotificationdetailedit gridpanel button[action=deleteLine]' : {
								click : this.deleteDetailLine
							},
							// 编辑额外耗料明细界面取消
							'ProductOutNotificationdetailedit button[action=cancel]' : {
								click : this.cancelDetail
							},
							// 编辑额外耗料明细界面保存
							'ProductOutNotificationdetailedit button[action=save]' : {
								click : this.saveDetailRecord
							},

							// 编辑界面直接提交
							'ProductOutNotificationedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'ProductOutNotificationedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'ProductOutNotificationedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'ProductOutNotificationedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ProductOutNotificationedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'ProductOutNotificationedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 监听编辑界面编辑事件
							'ProductOutNotificationedit grid' : {
								selectionchange : this.fieldChange
							}
						});
			},
			
			/**
			 * 页面初始化方法
			 * 
			 * @param {}
			 *            grid 事件触发控件
			 */
			initComponent : function(view) {
				this.listContainer = view;
				this.checkSession();
				this.listPanel = view.down('gridpanel[region=center]');// 表头列表
				this.detailPanel = view.down('gridpanel[gridId=entry]');// 明细列表
				this.detailEntryPanel = view.down('gridpanel[gridId=detail]');// 明细列表分录
				this.newButton = view.down('button[action=addNew]');// 新增按钮
				this.deleteButton = view.down('button[action=delete]');// 删除按钮
				this.editButton = view.down('button[action=modify]');// 编辑按钮
				this.submitButton = view.down('button[action=submit]');// 提交按钮
				this.rollbackButton = view.down('button[action=rollback]');// 撤销按钮

				this.listPanel.store.proxy.addListener('afterRequest', this.afterRequest, this); // 监听所有请求回调

				this.getEdit();
				this.afterInitComponent();
				this.initButtonByPermission();
				this.changeComponentsState();
				this.initEnterEvent();
				this.refreshRecord();
				this.searchMaterialId.store.load(); // 初始化物料列表

				this.printdata;
				this.submitLock = false;
			},
			
			/**
			 * 重新方法，增加查询条件控件的引用
			 */
			afterInitComponent : function() {
				this.searchStartDate = this.listPanel.down('datefield[name=searchStartDate]');
				this.searchEndDate = this.listPanel.down('datefield[name=searchEndDate]');
				this.searchMaterialId = this.listPanel.down('combogrid[name=searchMaterialId]');
				this.searchCustId = this.listPanel.down('combogrid[name=searchCustId]');
				this.searchStatus = this.listPanel.down('combobox[name=status]');
				this.allColumn = this.editEntry.query('gridcolumn');
				this.addLineButton = this.win.down('gridpanel button[action=addLine]');
				this.deleteLineButton = this.win.down('gridpanel button[action=deleteLine]');
				
				// 耗料明细页面
				this.viewDetailButton = this.win.down('gridpanel button[action=viewDetail]');
				this.detailWin = Ext.widget('ProductOutNotificationdetaillist');
				this.detailEntry = this.detailWin.down('gridpanel');

				// 额外耗料明细界面
				this.editDetailButton = this.win.down('gridpanel button[action=editDetail]');
				this.detailEditWin = Ext.widget('ProductOutNotificationdetailedit');
				this.detailEditEntry = this.detailEditWin.down('gridpanel');
			},
			
			/**
			 * 根据状态设置编辑界面状态
			 * 
			 * @param {}
			 *            isReadOnly
			 */
			changeEditStatus : function(record) {
				if (record.get('status') == '0') {
					this.setFieldsReadOnly(false);
					this.setGridEditAble(true);
					//this.saveButton.setDisabled(false);
					this.clearButton.setDisabled(false);
					this.submitEditButton.setDisabled(false);
					this.viewDetailButton.setVisible(false);
					this.editDetailButton.setVisible(true);
				} else {
					this.setFieldsReadOnly(true);
					this.setGridEditAble(false);
					//this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
					this.submitEditButton.setDisabled(true);
					this.viewDetailButton.setVisible(true);
					this.editDetailButton.setVisible(false);
				}
			},
			
			/**
			 * 设置界面可编辑性
			 * 
			 * @param {}
			 *            isReadOnly
			 */
			setFieldsReadOnly : function(isReadOnly) {
				Ext.each(this.fields, function(item, index, length) {
							if(!(item.name == 'packagedNotSend' || item.name == 'isFinished')){
								item.setReadOnly(isReadOnly);
							}
						})
			},
			
			/**
			 * 设置分录列表是否可编辑
			 * 
			 * @param {}
			 *            editAble
			 */
			setGridEditAble : function(editAble) {
				this.addLineButton.setDisabled(!editAble);
				this.deleteLineButton.setDisabled(!editAble);
				Ext.each(this.allColumn, function(item, index, length) {
							if (item.getEditor()) {
								item.getEditor().setDisabled(!editAble);
							}
						})
			},
			
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (this.searchStartDate.getValue()) {
					tempString += 'ProductOutNotificationV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (this.searchEndDate.getValue()) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ProductOutNotificationV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductOutNotificationEntryV.material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if (this.searchCustId.getValue() && this.searchCustId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductOutNotificationV.customer_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((this.searchStatus.getValue() && this.searchStatus.getValue() != '') || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductOutNotificationV.status = \'' + this.searchStatus.getValue() + '\'';
				}
				this.listPanel.store.getProxy().extraParams.whereStr = tempString;
				this.listPanel.store.load();
				this.detailPanel.store.removeAll();
				this.detailEntryPanel.store.removeAll();
				this.changeComponentsState();
			},

			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitProductOutNotification';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackProductOutNotification';
			},
			
			// 新增分录
			addDetailLine : function(button) {
				var entryRecord = Ext.create('ProductOutNotificationEntryDetailModel');
				entryRecord.phantom = true;
				// 设置父id
				entryRecord.set('parentId', this.currentDetailRecord.get('id'));
				entryRecord.set('sort', this.detailEditEntry.store.getCount()+1);
				this.detailEditEntry.store.add(entryRecord);
			},
			// 删除分录
			deleteDetailLine : function(button) {
				this.detailEditEntry.store.remove(this.getSelectedEntryDetail());
			},
			// 获取选择的分录行
			getSelectedEntryDetail : function() {
				var selMod = this.detailEditEntry.getSelectionModel();
				if (selMod != null) {
					return selMod.getLastSelected();
				}
			},
			
			// 显示分录明细信息
			showEntryDetail : function(me, record, index, eOpts) {
				if (record != null && record.get("id") != null) {
					var entryStore = this.detailEntryPanel.store;
					if (entryStore != null) {
						entryStore.clearFilter(true);
						entryStore.filter([{
									property : "parentId",
									value : record.get("id")
								}]);
						entryStore.load();
					}
				}
			},
			
			/**
			 * 查看加工件耗料情况
			 */
			viewDetailList : function() {
				var me = this ;
				var sm = me.editEntry.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();

					me.detailEntry.store.getProxy().extraParams.whereStr = "parent_id = '" + record.get('id') + "'";
					me.detailEntry.store.load(function(records, operation, success) {
						me.detailWin.show();
					});
				} else {
					showWarning('未选中物料！');
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
			modifyDetailRecord : function(grid, record) {
				var me = this;
				me.currentDetailRecord = record;
				me.detailEditWin.uiStatus = 'Modify';
				
				// 获取耗料列表
				me.detailEditEntry.store.getProxy().extraParams.whereStr = 'parent_id = \'' + record.get('id') + '\'';
				me.detailEditEntry.store.load(function(records, operation, success) {
					me.detailEditEntry.store.getProxy().extraParams.whereStr = "";
					me.detailEditWin.show();
				});
			},
			
			/**
			 * 点击修改按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			editDetailRecord : function(button) {
				var sm = this.editEntry.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();

					// 如果单据状态是已提交、已审核或者已经结算则不能修改
					this.modifyDetailRecord(this.editEntry, record);
				} else {
					showWarning('未选中物料！');
				}
			},
			
			/**
			 * 保存额外耗料列表
			 * 
			 * @param {}
			 *            button 保存按钮
			 */
			saveDetailRecord : function(button) {
				var me = this;
				me.detailEditEntry.store.sync({
							callback : function(batch, options) {
								if (!batch.hasException) {
									Ext.Msg.alert("提示", "保存成功！");
								}
							}
						});
				if (me.detailEditWin.isVisible()) {
					me.detailEditWin.close();
				}
			},
			
			/**
			 * 取消编辑
			 */
			cancelDetail : function() {
				this.detailEditWin.close();
			},
			
			/**
			 * 覆盖打印分录方法，汇总打印分录
			 */
			getPrintEntryView : function(){
				return 'ProductOutNotificationPrintEntryView';
			},
			getMainPrintHTML:function(){
				return "<div>"
				+"<div class='caption' >富桥旅游用品厂有限公司送货清单</div>"
				+"<div class='field'  style='width:45%;float:left;'  >单据编号:<span class='dataField' fieldindex='data.number' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>打印时间:<span class='dataField' fieldindex='data.printTime' width=150px ></span></div>"
				+"<div class='field' style='width:45%;float:left;'>收货单位:<span class='dataField' fieldindex='data.customerName' width=150px></span></div>"
				+"<div class='field' style='width:30%;float:left;'>货号:<span class='dataField' fieldindex='data.goodNumber' width=150px></span></div>"
				+"<div class='field' align='right' style='width:20%;float:right;'>日期:<span class='dataField' fieldindex='data.bizDate' width=150px></span></div>"
				+"<div class='nextLine'></div>"
				+"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>" 
				+"<tr> "
				+"<th bindfield='materialName' width='45%'>产品名称</th>" 
				+"<th bindfield='sumVolume' width='20%'>数量</th> "
				+"<th bindfield='unitUnitName' width='15%'>板数</th> "
				+"<th bindfield='volume' width='15%'>备注</th> "
				+"</table>" 
				+"<div class='field' style='width:25%;float:left;'>订仓号:<span class='dataField' fieldindex='data.finalHouseNumber' width=150px></span></div>"
				+"<div class='field' style='width:35%;float:left;'>车牌:<span class='dataField' fieldindex='data.carNumber' width=150px></span></div>"
				+"<div class='field' style='width:30%;float:left;'>柜号:<span class='dataField' fieldindex='data.finalContainerNumber' width=150px></span></div>"
				+"<div class='field' style='width:25%;float:left;'>封条号:<span class='dataField' fieldindex='data.sealNumber' width=150px></span></div>"
				+"<div class='field' style='width:35%;float:left;'>收货单位及经手人(盖章):<span class='dataField' fieldindex='data.returnerSystemUserName' width=150px></span></div>"
				+"<div class='field' style='width:35%;float:left;'>送货单位及经手人(盖章):<span class='dataField' fieldindex='data.submitterSystemUserName' width=150px></span></div>"
				+"<div class='field' style='width:80px;float:right;'>第<span class='dataField' fieldindex='data.curPage'></span>页/共<span class='dataField' fieldindex='data.totalPages'></span>页</div>"
				+"</div>";
			}
			
		});