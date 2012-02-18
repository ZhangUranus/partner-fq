Ext.define('SCM.controller.PurchaseReturn.PurchaseReturnController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['PurchaseReturn.ListUI', 'PurchaseReturn.EditUI'],
			stores : ['PurchaseReturn.PurchaseReturnStore', 'PurchaseReturn.PurchaseReturnEditStore', 'PurchaseReturn.PurchaseReturnEditEntryStore'],
			requires : ['SCM.model.PurchaseReturn.PurchaseReturnActionModel'],
			gridTitle : '采购退货单',
			editName : 'PurchaseReturnedit',
			editStoreName : 'PurchaseReturnEditStore',
			entityName : 'PurchaseReturn',
			modelName : 'PurchaseReturnEditModel',
			entryModelName : 'PurchaseReturnEditEntryModel',
			actionModelName : 'PurchaseReturnActionModel',
			init : function() {
				this.control({
							'PurchaseReturnlist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'PurchaseReturnlist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'PurchaseReturnlist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'PurchaseReturnlist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'PurchaseReturnlist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'PurchaseReturnlist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表提交按钮
							'PurchaseReturnlist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'PurchaseReturnlist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'PurchaseReturnlist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'PurchaseReturnlist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'PurchaseReturnedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'PurchaseReturnedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面直接提交
							'PurchaseReturnedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'PurchaseReturnedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'PurchaseReturnedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'PurchaseReturnedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'PurchaseReturnedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'PurchaseReturnedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'PurchaseReturnedit grid' : {
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
				this.searchMaterialId = this.listContainer.down('combogrid[name=searchMaterialId]');
				this.searchCustId = this.listContainer.down('combogrid[name=searchCustId]');
				this.totalFields = this.editForm.down('textfield[name=totalsum]');
				this.editEntry.store.proxy.addListener('afterRequest', this.changeStockVolume, this);
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (this.searchStartDate.getValue()) {
					tempString += 'PurchaseReturnV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (this.searchEndDate.getValue()) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'PurchaseReturnV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'PurchaseReturnEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if (this.searchCustId.getValue() && this.searchCustId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'PurchaseReturnV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
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
					var record = this.searchMaterialId.store.findRecord('id', e.value);
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
				return '../../scm/control/submitPurchaseReturn';
			},
			
			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function(){
				return '../../scm/control/rollbackPurchaseReturn';
			}
		});