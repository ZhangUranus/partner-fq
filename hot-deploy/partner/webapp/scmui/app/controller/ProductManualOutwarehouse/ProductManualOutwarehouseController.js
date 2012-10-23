Ext.define('SCM.controller.ProductManualOutwarehouse.ProductManualOutwarehouseController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ProductManualOutwarehouse.ListUI', 'ProductManualOutwarehouse.EditUI'],
			stores : ['ProductManualOutwarehouse.ProductManualOutwarehouseStore', 'ProductManualOutwarehouse.ProductManualOutwarehouseEditStore', 'ProductManualOutwarehouse.ProductManualOutwarehouseEditEntryStore'],
			requires : ['SCM.model.ProductManualOutwarehouse.ProductManualOutwarehouseActionModel'],
			gridTitle : '成品手工出仓单',
			editName : 'ProductManualOutwarehouseedit',
			editStoreName : 'ProductManualOutwarehouseEditStore',
			entityName : 'ProductManualOutwarehouse',
			modelName : 'ProductManualOutwarehouseEditModel',
			entryModelName : 'ProductManualOutwarehouseEditEntryModel',
			actionModelName : 'ProductManualOutwarehouseActionModel',
			init : function() {
				this.control({
							'ProductManualOutwarehouselist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'ProductManualOutwarehouselist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'ProductManualOutwarehouselist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'ProductManualOutwarehouselist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ProductManualOutwarehouselist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductManualOutwarehouselist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表提交按钮
							'ProductManualOutwarehouselist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'ProductManualOutwarehouselist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'ProductManualOutwarehouselist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'ProductManualOutwarehouselist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'ProductManualOutwarehouseedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ProductManualOutwarehouseedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面直接提交
							'ProductManualOutwarehouseedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'ProductManualOutwarehouseedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'ProductManualOutwarehouseedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'ProductManualOutwarehouseedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ProductManualOutwarehouseedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'ProductManualOutwarehouseedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'ProductManualOutwarehouseedit grid' : {
								selectionchange : this.fieldChange
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
				this.MaterialStore = Ext.data.StoreManager.lookup('MAllStore');
				
				this.searchCustId = this.listPanel.down('combogrid[name=searchCustId]');
				this.searchStatus = this.listPanel.down('combobox[name=status]');
				this.totalFields = this.editForm.down('textfield[name=totalsum]');
				this.editEntry.store.proxy.addListener('afterRequest', this.changeStockVolume, this);
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (!Ext.isEmpty(this.searchStartDate.getValue())) {
					tempString += 'ProductManualOutwarehouseV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (!Ext.isEmpty(this.searchEndDate.getValue())) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ProductManualOutwarehouseV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if (!Ext.isEmpty(this.searchKeyWord.getValue())){
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += '(materialMaterialV.name like \'%' + this.searchKeyWord.getValue() + '%\' or materialMaterialV.number like \'%' + this.searchKeyWord.getValue() + '%\')';
				}
				if (!Ext.isEmpty(this.searchCustId.getValue())) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductManualOutwarehouseV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((!Ext.isEmpty(this.searchStatus.getValue())) || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductManualOutwarehouseV.status = \'' + this.searchStatus.getValue() + '\'';
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
				if (e.field == 'materialMaterialId') {
					var record = this.MaterialStore.findRecord('id', e.value);
					if (record) {
						e.record.set('materialMaterialModel', record.get('model'));
						e.record.set('price', record.get('defaultPrice'));
						e.record.set('refPrice', record.get('defaultPrice'));
						e.record.set('unitUnitId', record.get('defaultUnitId'));
						e.record.set('unitUnitName', record.get('defaultUnitName'));
					}
					this.setStockVolume(e.record, e.record.get('warehouseWarehouseId'), e.value);
				} else if (e.field == 'warehouseWarehouseId') {
					this.setStockVolume(e.record, e.value, e.record.get('materialMaterialId'));
				}
				e.record.set('entrysum', e.record.get('price') * e.record.get('volume'));
				var count = e.grid.store.getCount();
				var sum = 0;
				for (var i = 0; i < count; i++) {
					sum += e.grid.store.getAt(i).get('entrysum');
				}
				this.totalFields.setValue(sum);
			},
			
			/**
			 * 修改库存
			 */
			changeStockVolume : function() {
				var me = this;
				var count = me.editEntry.store.getCount();
				var sum = 0;
				for (var i = 0; i < count; i++) {
					var tempRecord = me.editEntry.store.getAt(i);
					me.setStockVolume(tempRecord, tempRecord.get('warehouseWarehouseId'), tempRecord.get('materialMaterialId'))
				}
			},
			
			/**
			 * 获取某仓库某物料数量
			 * 
			 * @param {}
			 *            record
			 * @param {}
			 *            warehouseId
			 * @param {}
			 *            materialId
			 */
			setStockVolume : function(record, warehouseId, materialId) {
				if (!Ext.isEmpty(warehouseId) && !Ext.isEmpty(materialId)) {
					Ext.Ajax.request({
								scope : this,
								params : {
									warehouseId : warehouseId,
									materialId : materialId
								},
								url : '../../scm/control/getCurMaterialBalanceValue',
								timeout : SCM.shortTimes,
								success : function(response, option) {
									var result = Ext.decode(response.responseText)
									if (result.success) {
										record.set('stockVolume', result.stockVolume);
									} else {
										showError('获取仓库库存数量失败！');
									}
								}
							});
				}
			},
			
			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function(){
				return '../../scm/control/submitProductManualOutwarehouse';
			},
			
			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function(){
				return '../../scm/control/rollbackProductManualOutwarehouse';
			},
			getMainPrintHTML:function(){
				return "";
			}
		});