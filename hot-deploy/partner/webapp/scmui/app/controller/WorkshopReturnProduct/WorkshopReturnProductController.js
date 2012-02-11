Ext.define('SCM.controller.WorkshopReturnProduct.WorkshopReturnProductController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['WorkshopReturnProduct.ListUI', 'WorkshopReturnProduct.EditUI'],
			stores : ['WorkshopReturnProduct.WorkshopReturnProductStore', 'WorkshopReturnProduct.WorkshopReturnProductEditStore', 'WorkshopReturnProduct.WorkshopReturnProductEditEntryStore'],
			requires : ['SCM.model.WorkshopReturnProduct.WorkshopReturnProductActionModel'],
			gridTitle : '制造退货单',
			editName : 'WorkshopReturnProductedit',
			editStoreName : 'WorkshopReturnProductEditStore',
			entityName : 'WorkshopReturnProduct',
			modelName : 'WorkshopReturnProductEditModel',
			entryModelName : 'WorkshopReturnProductEditEntryModel',
			actionModelName : 'WorkshopReturnProductActionModel',
			init : function() {
				this.control({
							'WorkshopReturnProductlist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'WorkshopReturnProductlist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'WorkshopReturnProductlist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'WorkshopReturnProductlist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'WorkshopReturnProductlist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'WorkshopReturnProductlist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'WorkshopReturnProductlist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表反审核按钮
							'WorkshopReturnProductlist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'WorkshopReturnProductlist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'WorkshopReturnProductlist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'WorkshopReturnProductedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'WorkshopReturnProductedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面直接提交
							'WorkshopReturnProductedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'WorkshopReturnProductedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'WorkshopReturnProductedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'WorkshopReturnProductedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'WorkshopReturnProductedit button[action=cancel]' : {
								click : this.cancel
							},
							// 编辑界面验收
							'WorkshopReturnProductedit button[action=check]' : {
								click : this.saveAndCheckRecord
							},
							// 监听各field值变动事件，只监听可见控件
							'WorkshopReturnProductedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'WorkshopReturnProductedit grid' : {
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
				this.currentCheckVolumeColumn = this.editEntry.down('numbercolumn[dataIndex=currentCheckVolume]');
				this.volumeColumn = this.editEntry.down('numbercolumn[dataIndex=volume]');
				this.warehouseColumn = this.editEntry.down('combocolumn[dataIndex=warehouseWarehouseId]');
				this.marterialColumn = this.editEntry.down('combocolumn[dataIndex=materialMaterialId]');
				this.gridToolBar = this.editEntry.down('gridedittoolbar');
				this.checkButton = this.win.down('button[action=check]');
				this.checkBill = false;

				this.numberEditor = {
					xtype : 'numberfield',
					allowBlank : false,
					hideTrigger : true
				};
			},

			/**
			 * 根据状态设置编辑界面状态
			 * @param {} isReadOnly
			 */
			changeEditStatus : function(record) {
				if (record.get('status') == '0') {
					this.setFieldsReadOnly(false);
					this.editEntry.setDisabled(false);
					this.saveButton.setDisabled(false);
					this.clearButton.setDisabled(false);
					this.submitEditButton.setDisabled(false);
					this.checkButton.setVisible(false);
					this.volumeColumn.setEditor(this.numberEditor);
					this.currentCheckVolumeColumn.setEditor(null);
					this.warehouseColumn.getEditor().setDisabled(false);
					this.marterialColumn.getEditor().setDisabled(false);
					this.gridToolBar.setVisible(true);
				} else if (record.get('status') == '4' && record.get('checkStatus') != '2') {
					this.setFieldsReadOnly(true);
					this.editEntry.setDisabled(false);
					this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
					this.submitEditButton.setDisabled(true);
					this.checkButton.setVisible(true);
					this.volumeColumn.setEditor(null);
					this.currentCheckVolumeColumn.setEditor(this.numberEditor);
					this.warehouseColumn.getEditor().setDisabled(true);
					this.marterialColumn.getEditor().setDisabled(true);
					this.gridToolBar.setVisible(false);
				} else {
					this.setFieldsReadOnly(true);
					this.editEntry.setDisabled(true);
					this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
					this.submitEditButton.setDisabled(true);
					this.checkButton.setVisible(false);
					this.gridToolBar.setVisible(true);
				}
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (this.searchStartDate.getValue()) {
					tempString += 'WorkshopReturnProductV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (this.searchEndDate.getValue()) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'WorkshopReturnProductV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'WorkshopReturnProductEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if (this.searchCustId.getValue() && this.searchCustId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'WorkshopReturnProductV.workshop_workshop_id = \'' + this.searchCustId.getValue() + '\'';
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
						e.record.set('unitUnitId', record.get('defaultUnitId'));
						e.record.set('unitUnitName', record.get('defaultUnitName'));
					}
				}
			},

			/**
			 * 直接保存并提交单据
			 */
			saveAndCheckRecord : function() {
				this.isSubmitWhenSave = true;
				this.checkBill = true;
				this.win.modifyed = true;
				this.saveRecord();
			},

			/**
			 * 保存时提交单据
			 */
			doSubmitBill : function() {
				if (this.isSubmitWhenSave) {
					this.submitBill();
					this.isSubmitWhenSave = false;
					this.checkBill = false;
				}
			},

			/**
			 * 是否可以提交
			 * @return {Boolean}
			 */
			isSubmitAble : function(record) {
				if (this.checkBill) {
					if (record.get('checkStatus') == '2') {
						showWarning('单据已完成验收！');
						return false;
					} else {
						return true;
					}
				} else {
					if (record.get('status') != '0') {
						showWarning('单据已提交！');
						return false;
					} else {
						return true;
					}
				}
			},

			/**
			 * 是否可以撤销提交
			 * @param {} record
			 */
			isRollbackBillAble : function(record) {
				if (record.get('status') != '4') {
					showWarning('单据未提交！');
					return false;
				} else if (record.get('status') == '4' && record.get('checkStatus') == '1') {
					showWarning('单据验收中，不可撤销！');
					return false;
				} else if (record.get('status') == '4' && record.get('checkStatus') == '2') {
					showWarning('单据已验收，不可撤销！');
					return false;
				} else {
					return true;
				}
			},

			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitWorkshopReturnProduct';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackWorkshopReturnProduct';
			}
		});