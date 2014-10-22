Ext.define('SCM.controller.ProductInwarehouse.ProductInwarehouseController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ProductInwarehouse.ListUI', 'ProductInwarehouse.EditUI', 'ProductInwarehouse.DetailListUI', 'ProductInwarehouse.DetailEditUI', 'ProductInwarehouse.ScanUI',
					'ProductInwarehouse.UnScanUI', 'ProductInwarehouse.CheckListUI'],
			stores : ['ProductInwarehouse.ProductInwarehouseStore', 'ProductInwarehouse.ProductInwarehouseEditStore', 'ProductInwarehouse.ProductInwarehouseEditEntryStore',
					'ProductInwarehouse.ProductInwarehouseEntryDetailStore', 'ProductInwarehouse.ProductInwarehouseCheckStore','ProductInwarehouse.ProductInwarehouseEntryExtStore'],
			requires : ['SCM.model.ProductInwarehouse.ProductInwarehouseActionModel'],
			gridTitle : '成品进仓单',
			editName : 'ProductInwarehouseedit',
			editStoreName : 'ProductInwarehouseEditStore',
			entityName : 'ProductInwarehouse',
			modelName : 'ProductInwarehouseEditModel',
			entryModelName : 'ProductInwarehouseEditEntryModel',
			actionModelName : 'ProductInwarehouseActionModel',
			init : function() {
				this.control({
							'ProductInwarehouselist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'ProductInwarehouselist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'ProductInwarehouselist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'ProductInwarehouselist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ProductInwarehouselist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductInwarehouselist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表提交按钮
							'ProductInwarehouselist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表提交检查按钮
							'ProductInwarehouselist button[action=checkSubmit]' : {
								click : this.checkSubmit
							},
							// 列表撤销按钮
							'ProductInwarehouselist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'ProductInwarehouselist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'ProductInwarehouselist button[action=export]' : {
								click : this.exportExcel
							},
							// 打开扫描界面
							'ProductInwarehouselist button[action=scan]' : {
								click : this.openScanUI
							},
							// 打开撤销扫描界面
							'ProductInwarehouselist button[action=unscan]' : {
								click : this.openUnScanUI
							},
							// 编辑界面分录新增
							'ProductInwarehouseedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ProductInwarehouseedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},
							// 查看分录耗料明细
							'ProductInwarehouseedit gridpanel button[action=viewDetail]' : {
								click : this.viewDetailList
							},
							// 编辑界面分录额外耗料明细
							'ProductInwarehouseedit gridpanel button[action=editDetail]' : {
								click : this.editDetailRecord
							},
							// 编辑界面直接提交
							'ProductInwarehouseedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'ProductInwarehouseedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'ProductInwarehouseedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'ProductInwarehouseedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ProductInwarehouseedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'ProductInwarehouseedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'ProductInwarehouseedit grid' : {
								selectionchange : this.fieldChange
							},
							// 耗料明细添加行
							'ProductInwarehousedetailedit button[action=addLine]' : {
								click : this.detailAddLine
							},
							// 耗料明细删除行
							'ProductInwarehousedetailedit button[action=deleteLine]' : {
								click : this.detailRemoveLine
							},
							// 耗料明细界面取消
							'ProductInwarehousedetailedit button[action=cancel]' : {
								click : this.cancelDetail
							},
							// 耗料明细界面保存
							'ProductInwarehousedetailedit button[action=save]' : {
								click : this.saveDetailRecord
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
				this.MaterialStore = Ext.data.StoreManager.lookup('MAllStore');

				// 耗料明细页面
				this.viewDetailButton = this.win.down('gridpanel button[action=viewDetail]');
				this.detailWin = Ext.widget('ProductInwarehousedetaillist');
				this.detailEntry = this.detailWin.down('gridpanel');
				// 耗料编辑
				this.editDetailButton = this.win.down('gridpanel button[action=editDetail]');
				this.detailEditWin = Ext.widget('ProductInwarehousedetailedit');
				this.detailEditEntry = this.detailEditWin.down('gridpanel');

				// 提交检查页面
				this.checkWin = Ext.widget('ProductInwarehousechecklist');
				this.checkEntry = this.checkWin.down('gridpanel');

				this.detailEditEntry.addListener('edit', this.detailEntryEditAction, this);

				/* 进仓单分录 store 
				 * 
				 * noted by mark 2012-12-07删除进仓单分录查询，性能效率差
				Ext.create('ProductInwarehouseEditEntryStore', {
							pageSize : SCM.pageSize,
							storeId : 'PIHEntryStore',
							autoLoad : true,
							sorters : [{
										property : 'lastUpdatedStamp',
										direction : 'DESC'
									}]
						});*/
				

				// 初始化扫描、反扫描界面
				this.getScanUI();
				this.getUnScanUI();
				
				Ext.Array.push(this.listContainer.destroys,this.detailWin);
				Ext.Array.push(this.listContainer.destroys,this.detailEditWin);
				Ext.Array.push(this.listContainer.destroys,this.checkWin);
				Ext.Array.push(this.listContainer.destroys,this.winScan);
				Ext.Array.push(this.listContainer.destroys,this.winUnScan);
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
						this.viewDetailButton.setVisible(false);
						this.editDetailButton.setVisible(true);
					} else {
						this.setFieldsReadOnly(false);
						this.setGridEditAble(true);
						this.saveButton.setDisabled(false);
						this.clearButton.setDisabled(false);
						this.submitEditButton.setDisabled(false);
						this.viewDetailButton.setVisible(false);
						this.editDetailButton.setVisible(true);
					}
				} else {
					this.setFieldsReadOnly(true);
					this.setGridEditAble(false);
					this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
					this.submitEditButton.setDisabled(true);
					this.viewDetailButton.setVisible(true);
					this.editDetailButton.setVisible(false);
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
			 * 设置界面可编辑性
			 * 
			 * @param {}
			 *            isReadOnly
			 */
			setFieldsReadOnly : function(isReadOnly) {
				Ext.each(this.fields, function(item, index, length) {
							if(item.name !='note'){
								item.setReadOnly(isReadOnly);
							}
						})
			},
			
			/**
			 * 查看加工件耗料情况
			 */
			viewDetailList : function() {
				var sm = this.editEntry.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					if(record.get('isOut')==1){
						this.detailEntry.store.getProxy().extraParams.entity ='ProductInwarehouseEntryDetailHisView';
					}else {
						this.detailEntry.store.getProxy().extraParams.entity ='ProductInwarehouseEntryDetailView';
					}
					
					this.detailEntry.store.getProxy().extraParams.whereStr = "in_parent_id = '" + record.get('id') + "'";
					this.detailEntry.store.load();
					this.detailWin.show();
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

				var materialVolume = 1;
				if (record.get('volume') != 0) {
					materialVolume = record.get('volume');
				}

				// 获取耗料列表
				me.detailEditEntry.store.getProxy().extraParams.entity ='ProductInwarehouseEntryDetailView';
				me.detailEditEntry.store.getProxy().extraParams.whereStr = 'in_parent_id = \'' + record.get('id') + '\'';
				me.detailEditEntry.store.load(function(records, operation, success) {
							if (records.length <= 0) {// 如果不存在耗料列表，获取初始列表
								// 获取耗料列表
								Ext.Ajax.request({
											scope : me,
											params : {
												materialId : record.get('materialMaterialId')
											},
											url : '../../scm/control/getBomMaterialDetailList',
											timeout : SCM.shortTimes,
											success : function(response, option) {
												var result = Ext.decode(response.responseText)
												if (result.success) {
													me.detailEditEntry.store.removeAll();
													var values = result.message.records;
													for (var i = 0; i < values.length; i++) {
														var entryRecord = Ext.create('ProductInwarehouseEntryDetailModel');
														entryRecord.phantom = true;
														// 设置父id
														entryRecord.set('inParentParentId', record.get('parentId'));
														entryRecord.set('inParentId', record.get('id'));
														entryRecord.set('barcode1', record.get('barcode1'));
														entryRecord.set('barcode2', record.get('barcode2'));
														entryRecord.set('materialId', values[i].materialId);
														entryRecord.set('model', values[i].model);
														entryRecord.set('quantity', values[i].volume * materialVolume);
														entryRecord.set('unitUnitId', values[i].unitId);
														entryRecord.set('price', 0);
														entryRecord.set('amount', 0);
														entryRecord.set('isIn', 0);
														entryRecord.set('isOut', 0);
														me.detailEditEntry.store.add(entryRecord);
													}
												} else {
													showError('获取成品耗料列表失败！');
												}
											}
										});
							}
						});
				me.detailEditEntry.store.getProxy().extraParams.whereStr = "";
				this.detailEditWin.show();
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
					Ext.Ajax.request({
								scope : this,
								url : "../../scm/control/checkExist",
								timeout : SCM.shortTimes,
								params : {
									entity : 'ProductInwarehouseEntry',
									id : record.get('id')
								},
								success : function(response, option) {
									if (response.responseText.length < 1) {
										showError('系统没有返回结果');
									}
									var responseArray = Ext.JSON.decode(response.responseText);
									if (responseArray.success) {
										if (responseArray.isExist) {
											// 如果单据状态是已提交、已审核或者已经结算则不能修改
											this.modifyDetailRecord(this.editEntry, record);
										} else {
											showError('请先保存!');
										}
									} else {
										showError(responseArray.message);
									}
								}
							});

				} else {
					showWarning('未选中物料！');
				}
			},
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (!Ext.isEmpty(this.searchStartDate.getValue())) {
					tempString += 'ProductInwarehouseV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (!Ext.isEmpty(this.searchEndDate.getValue())) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ProductInwarehouseV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				// if(this.searchMaterialId.getValue() &&
				// this.searchMaterialId.getValue() != ''){
				// if(tempString != ''){
				// tempString += ' and ';
				// }
				// tempString += 'ProductInwarehouseEntryV.material_material_id
				// = \'' +
				// this.searchMaterialId.getValue() + '\'';
				// }
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
					tempString += 'ProductInwarehouseEntryV.workshop_workshop_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((!Ext.isEmpty(this.searchStatus.getValue())) || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductInwarehouseV.status = \'' + this.searchStatus.getValue() + '\'';
				}
				this.listPanel.store.getProxy().extraParams.whereStr = tempString;
				this.listPanel.store.load();
				this.detailPanel.store.removeAll();
				this.changeComponentsState();
			},
			/**
			 * 添加耗料记录
			 */
			detailAddLine : function() {
				var detailRecord = Ext.create('ProductInwarehouseEntryDetailModel');
				detailRecord.phantom = true;
				// 设置父id
				detailRecord.set('inParentParentId', record.get('parentId'));
				detailRecord.set('inParentId', this.currentDetailRecord.get('id'));
				detailRecord.set('barcode1', this.currentDetailRecord.get('barcode1'));
				detailRecord.set('barcode2', this.currentDetailRecord.get('barcode2'));
				// 默认单价，金额为零
				detailRecord.set('price', 0);
				detailRecord.set('amount', 0);
				detailRecord.set('isIn', 0);
				detailRecord.set('isOut', 0);
				this.detailEditEntry.store.add(detailRecord);
			},
			/**
			 * 删除耗料记录
			 */
			detailRemoveLine : function() {
				var selMod = this.detailEditEntry.getSelectionModel();
				if (selMod != null && selMod.getLastSelected() != null) {
					this.detailEditEntry.store.remove(selMod.getLastSelected());
				} else {
					showWarning('请选择分录');
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
									if (me.detailEditWin.isVisible()) {
										me.detailEditWin.close();
									}
									Ext.Msg.alert("提示", "保存成功！");
								}
							}
						});
			},

			/**
			 * 取消编辑
			 */
			cancelDetail : function() {
				this.detailEditWin.close();
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
			 * 耗料明细编辑事情
			 */
			detailEntryEditAction : function(editor, e) {
				// 自动填写规格型号和计量单位
				if (e.field == 'materialId') {
					var record = this.MaterialStore.findRecord('id', e.value);
					if (record) {
						e.record.set('model', record.get('model'));
						e.record.set('unitUnitId', record.get('defaultUnitId'));

					}
				}
			},

			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitProductInwarehouse';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackProductInwarehouse';
			},

			/**
			 * 提交检查，列出耗料库存情况
			 */
			checkSubmit : function() {
				var me = this;
				record = me.getSelectRecord();
				if (!me.isSubmitAble(record)) {
					return;
				}
				Ext.getBody().mask('正在进行检查提交过程....');
				Ext.Ajax.request({
							params : {
								billId : record.get('id')
							},
							url : '../../scm/control/checkSubmitProductInwarehouse',
							timeout : SCM.limitTimes,
							success : function(response, option) {
								var result = Ext.decode(response.responseText)
								if (result.success) {
									me.checkEntry.store.removeAll();
									var values = result.message.records;
									for (var i = 0; i < values.length; i++) {
										var entryRecord = Ext.create('ProductInwarehouseCheckModel');
										entryRecord.set('workshopId', values[i].workshopId);
										entryRecord.set('number', values[i].number);
										entryRecord.set('materialId', values[i].materialId);
										entryRecord.set('volume', values[i].volume);
										entryRecord.set('needVolume', values[i].needVolume);
										entryRecord.set('isEnough', !values[i].isEnough);
										me.checkEntry.store.add(entryRecord);
									}
									me.checkWin.show();
								} else {
									showError(result.message);
								}
								Ext.getBody().unmask();
							}
						});
			},

			/**
			 * 初始化扫描进仓界面，只初始化一次，关闭时候隐藏
			 */
			getScanUI : function() {
				if (!this.winScan || this.winScan.isDestroyed) {
					this.winScan = Ext.widget('ProductInwarehouseScan');
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
					// this.clearQantityButton =
					// this.winScan.down('button[action=clearQantity]');
					// this.clearQantityButton.addListener('click',
					// this.clearQantity, this); // 监听按钮点击事件
					this.isInitScanEvent = false;
					this.scanBoardCount = 0;
				}
				var me = this;
				// 初始化默认车间、仓库
				Ext.Ajax.request({
							scope : me,
							params : {
								numbers : "ProductInOutWorkshop,ProductInOutWarehouse"
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
										if (result.ProductInOutWorkshop) {
											me.workshopIdField.setValue(result.ProductInOutWorkshop);
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
			 * 清理扫描板产品数
			 */
			clearQantity : function() {
				this.boardCountLabel.setText('0');
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
								url : "../../scm/control/scanSubmitProductInwarehouse",
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
					this.winUnScan = Ext.widget('ProductInwarehouseUnScan');
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
										url : "../../scm/control/scanRollbackProductInwarehouse",
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