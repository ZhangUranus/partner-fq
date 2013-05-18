Ext.define('SCM.controller.ProductReturn.ProductReturnController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ProductReturn.ListUI', 'ProductReturn.EditUI', 'ProductReturn.ScanUI', 'ProductReturn.UnScanUI'],
			stores : ['ProductReturn.ProductReturnStore', 'ProductReturn.ProductReturnEditStore', 'ProductReturn.ProductReturnEditEntryStore'],
			requires : ['SCM.model.ProductReturn.ProductReturnActionModel'],
			gridTitle : '成品退货单',
			editName : 'ProductReturnedit',
			editStoreName : 'ProductReturnEditStore',
			entityName : 'ProductReturn',
			modelName : 'ProductReturnEditModel',
			entryModelName : 'ProductReturnEditEntryModel',
			actionModelName : 'ProductReturnActionModel',
			init : function() {
				this.control({
							'ProductReturnlist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'ProductReturnlist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'ProductReturnlist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'ProductReturnlist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ProductReturnlist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductReturnlist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表提交按钮
							'ProductReturnlist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'ProductReturnlist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'ProductReturnlist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'ProductReturnlist button[action=export]' : {
								click : this.exportExcel
							},
							// 打开扫描界面
							'ProductReturnlist button[action=scan]' : {
								click : this.openScanUI
							},
							// 打开撤销扫描界面
							'ProductReturnlist button[action=unscan]' : {
								click : this.openUnScanUI
							},
							// 编辑界面分录新增
							'ProductReturnedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ProductReturnedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},
							// 编辑界面直接提交
							'ProductReturnedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'ProductReturnedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'ProductReturnedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'ProductReturnedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ProductReturnedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'ProductReturnedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 分录变更事件
							'ProductReturnedit grid' : {
								selectionchange : this.fieldChange
							}
						});
			},

			/**
			 * 重新方法，增加查询条件控件的引用
			 */
			afterInitComponent : function() {
				this.searchStartDate = this.listContainer.down('datefield[name=searchStartDate]');
				this.searchEndDate = this.listContainer.down('datefield[name=searchEndDate]');
				this.searchKeyWord = this.listPanel.down('textfield[name=searchKeyWord]');

				this.searchCustId = this.listContainer.down('combogrid[name=searchCustId]');
				this.searchStatus = this.listPanel.down('combobox[name=status]');
				this.allColumn = this.editEntry.query('gridcolumn');
				this.addLineButton = this.win.down('gridpanel button[action=addLine]');
				this.deleteLineButton = this.win.down('gridpanel button[action=deleteLine]');
				this.MaterialBOMStore = Ext.data.StoreManager.lookup('MBAllStore');

				// 初始化扫描、反扫描界面
				this.getScanUI();
				this.getUnScanUI();
			},

			/**
			 * 根据状态设置编辑界面状态
			 * 
			 * @param {}
			 *            isReadOnly
			 */
			changeEditStatus : function(record) {
				if (record.get('status') == '0') {
					if (record.get('billType') == 2) {
						this.setFieldsReadOnly(true);
						this.setGridEditAble(false);
						this.saveButton.setDisabled(false);
						this.clearButton.setDisabled(true);
						this.submitEditButton.setDisabled(false);
					} else {
						this.setFieldsReadOnly(false);
						this.setGridEditAble(true);
						this.saveButton.setDisabled(false);
						this.clearButton.setDisabled(false);
						this.submitEditButton.setDisabled(false);
					}
				} else {
					this.setFieldsReadOnly(true);
					this.setGridEditAble(false);
					this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
					this.submitEditButton.setDisabled(true);
				}
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
				if (!Ext.isEmpty(this.searchStartDate.getValue())) {
					tempString += 'ProductReturnV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (!Ext.isEmpty(this.searchEndDate.getValue())) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ProductReturnV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if (!Ext.isEmpty(this.searchKeyWord.getValue())) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += '(materialMaterialV.name like \'%' + this.searchKeyWord.getValue() + '%\' or materialMaterialV.number like \'%' + this.searchKeyWord.getValue() + '%\')';
				}
				if (!Ext.isEmpty(this.searchCustId.getValue())) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductReturnEntryV.workshop_workshop_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((!Ext.isEmpty(this.searchStatus.getValue())) || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductReturnV.status = \'' + this.searchStatus.getValue() + '\'';
				}
				this.listPanel.store.getProxy().extraParams.whereStr = tempString;
				this.listPanel.store.load();
				this.detailPanel.store.removeAll();
				this.changeComponentsState();
			},
			/**
			 * 当用户编辑grid时，同步更新相关表单数据
			 * 
			 * @param {}
			 *            editor
			 * @param {}
			 *            e
			 */
			initMaterialInfo : function(editor, e) {
				var me = this;
				if (e.field == 'barcode1' || e.field == 'barcode2') {
					if (!Ext.isEmpty(e.record.get('barcode1')) && !Ext.isEmpty(e.record.get('barcode2'))) {
						var barcode = Ext.create('SCM.extend.utils.Barcode', e.record.get('barcode1'), e.record.get('barcode2'));
						var pWeek = barcode.getProductWeek();
						var quantity = barcode.getQuantity();
						e.record.set('productWeek', pWeek);
						e.record.set('qantity', quantity);

						// 获取产品编码
						Ext.Ajax.request({
									scope : me,
									params : {
										ikeaId : barcode.getCodeForIkea(),
										qantity : barcode.getQuantity()
									},
									url : '../../scm/control/getMaterialIdByIkea',
									timeout : SCM.shortTimes,
									success : function(response, option) {
										var result = Ext.decode(response.responseText)
										if (result.success) {
											e.record.set('materialMaterialId', result.materialId);
											var record = me.MaterialBOMStore.findRecord('materialId', result.materialId);
											if (record) {
												e.record.set('materialModel', record.get('bomModel'));
												e.record.set('unitUnitId', record.get('bomUnitId'));
											}
										} else {
											showError('获取产品编码失败！');
										}
									}
								});
					}
				} else if (e.field == 'materialMaterialId') {
					var record = me.MaterialBOMStore.findRecord('materialId', e.value);
					if (record) {
						e.record.set('materialModel', record.get('bomModel'));
						e.record.set('unitUnitId', record.get('bomUnitId'));
					}
				}
			},
			/**
			 * 初始化用户选择
			 * 
			 * @param {}
			 *            record
			 */
			initCurrentUserSelect : function(record) {
				record.set('inspectorSystemUserId', SCM.CurrentUser.id);
			},

			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitProductReturn';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackProductReturn';
			},

			/**
			 * 初始化扫描进仓界面，只初始化一次，关闭时候隐藏
			 */
			getScanUI : function() {
				if (!this.winScan || this.winScan.isDestroyed) {
					this.winScan = Ext.widget('ProductReturnScan');
					this.scanForm = this.winScan.down('form');
					this.scanGrid = this.winScan.down('gridpanel');
					this.scanFields = this.scanForm.query("textfield{hidden==false}{readOnly==false}"); // 取所有显示的field
					this.warehouseIdField = this.winScan.down('combogrid[name=warehouseId]');
					this.workshopIdField = this.winScan.down('combogrid[name=workshopId]');
					this.barcode1Field = this.winScan.down('textfield[name=barcode1]');
					this.barcode2Field = this.winScan.down('textfield[name=barcode2]');
					this.confirmBarcode1Field = this.winScan.down('textfield[name=confirmBarcode1]');
					this.confirmBarcode2Field = this.winScan.down('textfield[name=confirmBarcode2]');
					this.ikeaCodeField = this.winScan.down('textfield[name=ikeaCode]');
					this.qantityLabel = this.winScan.down('label[name=qantity]');
					this.boardCountLabel = this.winScan.down('label[name=boardCount]');
					this.currentIkeaCodeAndQantity = "";
					this.isInitScanEvent = false;
					this.scanBoardCount = 0;
				}
				var me = this;
				// 初始化默认车间、仓库
				Ext.Ajax.request({
							scope : me,
							params : {
								numbers : "ProductInOutWarehouse"
							},
							url : '../../scm/control/getParamtmers',
							timeout : SCM.shortTimes,
							success : function(response, option) {
								var result = Ext.decode(response.responseText)
								if (result.success) {
									if (result.isExist) {
										if (result.ProductInOutWarehouse) {
											me.warehouseIdField.setValue(result.ProductInOutWarehouse);
										}
									}
								}
								
								/*初始化完后，load进仓单分录
								 * added by mark
								 */
								me.scanGrid.store.load();
							}
						});
				return this.winScan;
			},

			/**
			 * 初始化扫描事件
			 */
			initScanEvent : function() {
				if (!this.isInitScanEvent) {
					var barcode1Map = new Ext.util.KeyMap(this.barcode1Field.getEl(), [{
										scope : this.barcode2Field,
										key : Ext.EventObject.ENTER,
										fn : this.changeFocus
									}]);
					var barcode2Map = new Ext.util.KeyMap(this.barcode2Field.getEl(), [{
										scope : this.confirmBarcode1Field,
										key : Ext.EventObject.ENTER,
										fn : this.changeFocus
									}]);
					var confirmBarcode1Map = new Ext.util.KeyMap(this.confirmBarcode1Field.getEl(), [{
										scope : this,
										key : Ext.EventObject.ENTER,
										fn : this.checkBarcode1
									}]);
					var confirmBarcode2Map = new Ext.util.KeyMap(this.confirmBarcode2Field.getEl(), [{
										scope : this,
										key : Ext.EventObject.ENTER,
										fn : this.checkBarcode2
									}]);
					var ikeaCodeMap = new Ext.util.KeyMap(this.ikeaCodeField.getEl(), [{
										scope : this,
										key : Ext.EventObject.ENTER,
										fn : this.submitScan
									}]);
					this.isInitScanEvent = true;
				}
			},

			/**
			 * 当在产品条码输入框点击回车时，切换焦点到序列号输入框
			 */
			changeFocus : function() {
				this.focus();
			},

			/**
			 * 确认产品条码
			 */
			checkBarcode1 : function() {
				if (this.barcode1Field.getValue() != this.confirmBarcode1Field.getValue()) {
					this.clearField();
					showError('产品条码和确认产品条码不一致，请检查并重新扫描！');
					this.barcode1Field.focus(true);
				} else {
					this.confirmBarcode2Field.focus();
				}
			},

			/**
			 * 确认序列号
			 */
			checkBarcode2 : function() {
				if (this.barcode2Field.getValue() != this.confirmBarcode2Field.getValue()) {
					this.clearField();
					showError('序列号和确认序列号不一致，请检查并重新扫描！');
					this.barcode1Field.focus(true);
				} else {
					this.ikeaCodeField.focus();
				}
			},

			/**
			 * 当在序列号输入框点击回车时，提交进仓条码
			 */
			submitScan : function() {
				var me = this;
				if (me.barcode1Field.getValue() && me.barcode2Field.getValue()) {
					var barcode = Ext.create('SCM.extend.utils.Barcode', me.barcode1Field.getValue(), me.barcode2Field.getValue());
					var ikeaCode = barcode.getCodeForIkea() + "167399";
					if (ikeaCode != me.ikeaCodeField.getValue()) {
						me.clearField();
						showError('宜家编码和产品条码不一致，请检查并重新扫描！');
						me.barcode1Field.focus(true);
						return false;
					}

					// 将form数据转换
					var recordsData = [];
					recordsData.push(me.scanForm.getValues());
					var json = Ext.encode(recordsData);
					Ext.Ajax.request({
								scope : me,
								url : "../../scm/control/scanSubmitProductReturn",
								timeout : SCM.shortTimes,
								params : {
									records : json
								},
								success : function(response, option) {
									if (response.responseText.length < 1) {
										showError('系统没有返回结果');
									}
									var result = Ext.JSON.decode(response.responseText);
									if (result.success) {
										var tempCode = barcode.getCodeForIkea() + result.message.qantity;
										if (me.currentIkeaCodeAndQantity != tempCode) {
											me.currentIkeaCodeAndQantity = tempCode;
											me.scanBoardCount = 0;
										}
										me.qantityLabel.setText(result.message.qantity);
										me.clearField();
										me.scanBoardCount++;
										me.boardCountLabel.setText(me.scanBoardCount);
										me.scanGrid.store.load();
										me.barcode1Field.focus(true);
									} else {
										me.clearField();
										showError(result.message);
										me.barcode1Field.focus(true);
									}
								}
							});
				}
			},

			/**
			 * 清理文本框
			 * 
			 * @return {}
			 */
			clearField : function() {
				this.barcode1Field.setValue('');
				this.barcode2Field.setValue('');
				this.confirmBarcode1Field.setValue('');
				this.confirmBarcode2Field.setValue('');
				this.ikeaCodeField.setValue('');
			},

			/**
			 * 初始化撤销扫描进仓界面，只初始化一次，关闭时候隐藏
			 */
			getUnScanUI : function() {
				if (!this.winUnScan || this.winUnScan.isDestroyed) {
					this.winUnScan = Ext.widget('ProductReturnUnScan');
					this.unScanForm = this.winUnScan.down('form');
					this.unScanGrid = this.winUnScan.down('gridpanel');
					this.unScanBarcode1Field = this.winUnScan.down('textfield[name=barcode1]');
					this.unScanBarcode2Field = this.winUnScan.down('textfield[name=barcode2]');
					this.isInitUnScanEvent = false;
				}
				return this.winUnScan;
			},

			/**
			 * 初始化扫描事件
			 */
			initUnScanEvent : function() {
				if (!this.isInitUnScanEvent) {
					var unScanBarcode1Map = new Ext.util.KeyMap(this.unScanBarcode1Field.getEl(), [{
										scope : this,
										key : Ext.EventObject.ENTER,
										fn : this.changeFocusUnScan
									}]);
					var unScanBarcode2Map = new Ext.util.KeyMap(this.unScanBarcode2Field.getEl(), [{
										scope : this,
										key : Ext.EventObject.ENTER,
										fn : this.submitUnScan
									}]);
					this.isInitUnScanEvent = true;
				}
			},

			/**
			 * 当在产品条码输入框点击回车时，切换焦点到序列号输入框
			 */
			changeFocusUnScan : function() {
				this.unScanBarcode2Field.focus();
			},

			/**
			 * 当在序列号输入框点击回车时，提交进仓条码
			 */
			submitUnScan : function() {
				var me = this;
				if (me.unScanBarcode1Field.getValue() && me.unScanBarcode2Field.getValue()) {

					// 将form数据转换
					var recordsData = [];
					recordsData.push(me.unScanForm.getValues());
					var json = Ext.encode(recordsData);
					Ext.Msg.confirm('提示', '是否确定撤销进仓操作？', submitUnScanConfirm, me);
					function submitUnScanConfirm(id) {
						if (id == 'yes') {
							Ext.Ajax.request({
										scope : me,
										url : "../../scm/control/scanRollbackProductReturn",
										timeout : SCM.shortTimes,
										params : {
											records : json
										},
										success : function(response, option) {
											if (response.responseText.length < 1) {
												showError('系统没有返回结果');
											}
											var result = Ext.JSON.decode(response.responseText);
											if (result.success) {
												me.unScanBarcode1Field.setValue('');
												me.unScanBarcode2Field.setValue('');
												me.unScanGrid.store.load();
												Ext.Msg.alert("提示", "撤销成功！");
												me.unScanBarcode1Field.focus(true);
											} else {
												me.unScanBarcode1Field.setValue('');
												me.unScanBarcode2Field.setValue('');
												showError(result.message);
												me.unScanBarcode1Field.focus(true);
											}
										}
									});
						}
					}
				}
			},

			/**
			 * 打开扫描进仓界面
			 */
			openScanUI : function() {
				this.winScan.show();
				this.initScanEvent();
				this.boardCountLabel.setText(this.scanBoardCount);
			},

			/**
			 * 打开撤销扫描进仓界面
			 */
			openUnScanUI : function() {
				this.winUnScan.show();
				this.initUnScanEvent();
			}
		});