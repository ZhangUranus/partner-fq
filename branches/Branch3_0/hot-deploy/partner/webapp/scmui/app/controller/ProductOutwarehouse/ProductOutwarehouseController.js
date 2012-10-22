Ext.define('SCM.controller.ProductOutwarehouse.ProductOutwarehouseController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ProductOutwarehouse.ListUI', 'ProductOutwarehouse.EditUI', 'ProductOutwarehouse.ScanUI', 'ProductOutwarehouse.UnScanUI', 'ProductOutwarehouse.DetailListUI', 'ProductOutwarehouse.NotificationDetailListUI'],
			stores : ['ProductOutwarehouse.ProductOutwarehouseStore', 'ProductOutwarehouse.ProductOutwarehouseEditStore', 'ProductOutwarehouse.ProductOutwarehouseEditEntryStore', 'ProductOutwarehouse.ProductOutDetailStore'],
			requires : ['SCM.model.ProductOutwarehouse.ProductOutwarehouseActionModel'],
			gridTitle : '成品出仓单',
			editName : 'ProductOutwarehouseedit',
			editStoreName : 'ProductOutwarehouseEditStore',
			entityName : 'ProductOutwarehouse',
			modelName : 'ProductOutwarehouseEditModel',
			entryModelName : 'ProductOutwarehouseEditEntryModel',
			actionModelName : 'ProductOutwarehouseActionModel',
			init : function() {
				this.control({
							'ProductOutwarehouselist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'ProductOutwarehouselist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'ProductOutwarehouselist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'ProductOutwarehouselist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ProductOutwarehouselist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductOutwarehouselist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'ProductOutwarehouselist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表反审核按钮
							'ProductOutwarehouselist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'ProductOutwarehouselist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'ProductOutwarehouselist button[action=export]' : {
								click : this.exportExcel
							},
							// 打开扫描界面
							'ProductOutwarehouselist button[action=scan]' : {
								click : this.openScanUI
							},
							// 打开撤销扫描界面
							'ProductOutwarehouselist button[action=unscan]' : {
								click : this.openUnScanUI
							},
							// 编辑界面分录新增
							'ProductOutwarehouseedit gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ProductOutwarehouseedit gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面直接提交
							'ProductOutwarehouseedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'ProductOutwarehouseedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'ProductOutwarehouseedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'ProductOutwarehouseedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ProductOutwarehouseedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'ProductOutwarehouseedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'ProductOutwarehouseedit grid' : {
								selectionchange : this.fieldChange
							},
							// 出仓情况页面查询事件
							'ProductOutwarehouseDetailList gridpanel button[action=search]' : {
								click : this.searchDetailList
							},
							// 出仓情况页面查询事件
							'ProductOutwarehouseNotificationDetailList gridpanel button[action=search]' : {
								click : this.searchNotiDetailList
							}
						});
			},

			/**
			 * 重新方法，增加查询条件控件的引用
			 */
			afterInitComponent : function() {
				this.searchStartDate = this.listPanel.down('datefield[name=searchStartDate]');
				this.searchEndDate = this.listPanel.down('datefield[name=searchEndDate]');
				this.searchKeyWord = this.listPanel.down('textfield[name=searchKeyWord]');

				this.searchCustId = this.listPanel.down('combogrid[name=searchCustId]');
				this.searchStatus = this.listPanel.down('combobox[name=status]');
				this.MaterialBOMStore = Ext.data.StoreManager.lookup('MBAllStore');
				
				// 初始化扫描、反扫描界面
				this.getScanUI();
				this.getUnScanUI();
				this.getDetailListUI();
				this.getNotiDetailListUI();
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (!Ext.isEmpty(this.searchStartDate.getValue())) {
					tempString += 'ProductOutwarehouseV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (!Ext.isEmpty(this.searchEndDate.getValue())) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ProductOutwarehouseV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
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
					tempString += 'ProductOutwarehouseEntryV.warehouse_warehouse_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((!Ext.isEmpty(this.searchStatus.getValue())) || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductOutwarehouseV.status = \'' + this.searchStatus.getValue() + '\'';
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
						e.record.set('prdWeek', pWeek);
						e.record.set('qantity', quantity);

						// 获取产品编码
						Ext.Ajax.request({
									scope : me,
									params : {
										ikeaId : barcode.getCodeForIkea(),
										qantity : barcode.getQuantity()
									},
									url : '../../scm/control/getMaterialIdByIkea',
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
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitProductOutwarehouse';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackProductOutwarehouse';
			},

			/**
			 * 初始化扫描出仓界面，只初始化一次，关闭时候隐藏
			 */
			getScanUI : function() {
				if (!this.winScan || this.winScan.isDestroyed) {
					this.winScan = Ext.widget('ProductOutwarehouseScan');
					this.scanForm = this.winScan.down('form');
					this.scanGrid = this.winScan.down('gridpanel');
					this.scanFields = this.scanForm.query("textfield{hidden==false}{readOnly==false}"); // 取所有显示的field
					this.barcode1Field = this.winScan.down('textfield[name=barcode1]');
					this.barcode2Field = this.winScan.down('textfield[name=barcode2]');
					this.qantityLabel = this.winScan.down('label[name=qantity]');
					this.boardCountLabel = this.winScan.down('label[name=boardCount]');
					this.searchDetailButton = this.winScan.down('button[action=search]');
					this.searchDetailButton.addListener('click', this.openDetailListUI, this); // 监听按钮点击事件
					this.searchNotiDetailButton = this.winScan.down('button[action=searchNoti]');
					this.searchNotiDetailButton.addListener('click', this.openNotiDetailListUI, this); // 监听按钮点击事件
					this.isInitScanEvent = false;
					this.scanBoardCount = 0;
				}
				return this.winScan;
			},

			/**
			 * 初始化扫描事件
			 */
			initScanEvent : function() {
				if (!this.isInitScanEvent) {
					var barcode1Map = new Ext.util.KeyMap(this.barcode1Field.getEl(), [{
										scope : this,
										key : Ext.EventObject.ENTER,
										fn : this.changeFocus
									}]);
					var barcode2Map = new Ext.util.KeyMap(this.barcode2Field.getEl(), [{
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
				this.barcode2Field.focus();
			},

			/**
			 * 当在序列号输入框点击回车时，提交出仓条码
			 */
			submitScan : function() {
				var me = this;
				if (me.barcode1Field.getValue() && me.barcode2Field.getValue()) {

					// 将form数据转换
					var recordsData = [];
					recordsData.push(me.scanForm.getValues());
					var json = Ext.encode(recordsData);

					Ext.Ajax.request({
								scope : me,
								url : "../../scm/control/scanSubmitProductOutwarehouse",
								params : {
									records : json
								},
								success : function(response, option) {
									if (response.responseText.length < 1) {
										showError('系统没有返回结果');
									}
									var result = Ext.JSON.decode(response.responseText);
									if (result.success) {
										me.qantityLabel.setText(result.message.qantity);
										me.barcode1Field.setValue('');
										me.barcode2Field.setValue('');
										me.scanBoardCount++;
										me.boardCountLabel.setText(me.scanBoardCount);
										me.scanGrid.store.load();
										me.barcode1Field.focus(true);
									} else {
										me.barcode1Field.setValue('');
										me.barcode2Field.setValue('');
										showError(result.message);
										me.barcode1Field.focus(true);
									}
								}
							});
				}
			},

			/**
			 * 初始化撤销扫描出仓界面，只初始化一次，关闭时候隐藏
			 */
			getUnScanUI : function() {
				if (!this.winUnScan || this.winUnScan.isDestroyed) {
					this.winUnScan = Ext.widget('ProductOutwarehouseUnScan');
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
			 * 当在序列号输入框点击回车时，提交出仓条码
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
										url : "../../scm/control/scanRollbackProductOutwarehouse",
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
			},
			
			/**
			 * 初始化出仓情况页面
			 */
			getDetailListUI : function() {
				if (!this.winDetailList || this.winDetailList.isDestroyed) {
					this.winDetailList = Ext.widget('ProductOutwarehouseDetailList');
					this.detailListGrid = this.winDetailList.down('gridpanel');
					this.goodNumbersField = this.winDetailList.down('textfield[name=goodNumbers]');
					this.searchStartDateDetail = this.winDetailList.down('datefield[name=searchStartDate]');
					this.searchEndDateDetail = this.winDetailList.down('datefield[name=searchEndDate]');
				}
				return this.winDetailList;
			},
			
			/**
			 * 打开撤销扫描进仓界面
			 */
			openDetailListUI : function() {
				this.winDetailList.show();
				this.detailListGrid.store.load();
			},
			
			/**
			 * 查询出仓情况页面
			 */
			searchDetailList : function() {
				var tempString = "";
				if (!Ext.isEmpty(this.searchStartDateDetail.getValue())) {
					tempString += 'ProductOutwarehouseEntryV.LAST_UPDATED_STAMP >= \'' + this.searchStartDateDetail.getRawValue() + ' 00:00:00\'';
				}
				if (!Ext.isEmpty(this.searchEndDateDetail.getValue())) {
					if (tempString != '') {
						if (this.searchStartDateDetail.getRawValue() > this.searchEndDateDetail.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ProductOutwarehouseEntryV.LAST_UPDATED_STAMP <= \'' + this.searchEndDateDetail.getRawValue() + ' 23:59:59\'';
				}
				if (!Ext.isEmpty(this.goodNumbersField.getValue())) {
					tempString += ' and (';
					var goodNumberArr = this.goodNumbersField.getValue().split(',');
					for(var i=0;i<goodNumberArr.length;i++){
						if(i!=0){
							tempString += ' OR ';
						}
						tempString += 'ProductOutwarehouseEntryV.GOOD_NUMBER = \'' + goodNumberArr[i] + '\'';
					}
					tempString += ')';
				}
				this.detailListGrid.store.getProxy().extraParams.whereStr = tempString;
				this.detailListGrid.store.load();
			},
			
			
			/**
			 * 初始化出仓情况页面
			 */
			getNotiDetailListUI : function() {
				if (!this.winNotiDetailList || this.winNotiDetailList.isDestroyed) {
					this.winNotiDetailList = Ext.widget('ProductOutwarehouseNotificationDetailList');
					this.notiDetailListGrid = this.winNotiDetailList.down('gridpanel');
					this.goodNumbersNotiField = this.winNotiDetailList.down('textfield[name=goodNumbers]');
					this.searchStartDateNotiDetail = this.winNotiDetailList.down('datefield[name=searchStartDate]');
					this.searchEndDateNotiDetail = this.winNotiDetailList.down('datefield[name=searchEndDate]');
				}
				return this.winNotiDetailList;
			},
			
			/**
			 * 打开撤销扫描进仓界面
			 */
			openNotiDetailListUI : function() {
				this.winNotiDetailList.show();
				this.notiDetailListGrid.store.load();
			},
			
			/**
			 * 查询出仓情况页面
			 */
			searchNotiDetailList : function() {
				var tempString = "";
				if (!Ext.isEmpty(this.searchStartDateNotiDetail.getValue())) {
					tempString += 'ProductOutNotificationV.LAST_UPDATED_STAMP >= \'' + this.searchStartDateNotiDetail.getRawValue() + ' 00:00:00\'';
				}
				if (!Ext.isEmpty(this.searchEndDateNotiDetail.getValue())) {
					if (tempString != '') {
						if (this.searchStartDateNotiDetail.getRawValue() > this.searchEndDateNotiDetail.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ProductOutNotificationV.LAST_UPDATED_STAMP <= \'' + this.searchEndDateNotiDetail.getRawValue() + ' 23:59:59\'';
				}
				if (!Ext.isEmpty(this.goodNumbersNotiField.getValue())) {
					tempString += ' and (';
					var goodNumberArr = this.goodNumbersNotiField.getValue().split(',');
					for(var i=0;i<goodNumberArr.length;i++){
						if(i!=0){
							tempString += ' OR ';
						}
						tempString += 'ProductOutNotificationV.GOOD_NUMBER = \'' + goodNumberArr[i] + '\'';
					}
					tempString += ')';
				}
				this.notiDetailListGrid.store.getProxy().extraParams.whereStr = tempString;
				this.notiDetailListGrid.store.load();
			}

		});