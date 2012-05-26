Ext.define('SCM.controller.ConsignReturnProduct.ConsignReturnProductController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ConsignReturnProduct.ListUI', 'ConsignReturnProduct.EditUI'],
			stores : ['ConsignReturnProduct.ConsignReturnProductStore', 'ConsignReturnProduct.ConsignReturnProductEditStore', 'ConsignReturnProduct.ConsignReturnProductEditEntryStore'],
			requires : ['SCM.model.ConsignReturnProduct.ConsignReturnProductActionModel'],
			gridTitle : '委外退货单',
			editName : 'ConsignReturnProductedit',
			editStoreName : 'ConsignReturnProductEditStore',
			entityName : 'ConsignReturnProduct',
			modelName : 'ConsignReturnProductEditModel',
			entryModelName : 'ConsignReturnProductEditEntryModel',
			actionModelName : 'ConsignReturnProductActionModel',
			init : function() {
				this.control({
							'ConsignReturnProductlist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'ConsignReturnProductlist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'ConsignReturnProductlist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'ConsignReturnProductlist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ConsignReturnProductlist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ConsignReturnProductlist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'ConsignReturnProductlist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表反审核按钮
							'ConsignReturnProductlist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'ConsignReturnProductlist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'ConsignReturnProductlist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'ConsignReturnProductedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ConsignReturnProductedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面直接提交
							'ConsignReturnProductedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'ConsignReturnProductedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'ConsignReturnProductedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'ConsignReturnProductedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ConsignReturnProductedit button[action=cancel]' : {
								click : this.cancel
							},
							// 编辑界面验收
							'ConsignReturnProductedit button[action=check]' : {
								click : this.saveAndCheckRecord
							},
							// 监听各field值变动事件，只监听可见控件
							'ConsignReturnProductedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'ConsignReturnProductedit grid' : {
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
				this.searchMaterialId = this.listPanel.down('combogrid[name=searchMaterialId]');
				this.searchCustId = this.listPanel.down('combogrid[name=searchCustId]');
				this.searchStatus = this.listPanel.down('combobox[name=status]');
				this.currentCheckVolumeColumn = this.editEntry.down('numbercolumn[dataIndex=currentCheckVolume]');
				this.volumeColumn = this.editEntry.down('numbercolumn[dataIndex=volume]');
				this.warehouseColumn = this.editEntry.down('combocolumn[dataIndex=warehouseWarehouseId]');
				this.marterialColumn = this.editEntry.down('combocolumn[dataIndex=bomId]');
				this.MaterialStore = Ext.data.StoreManager.lookup('MBAllStore');
				this.MaterialStore.load();
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
			 * 初始化用户选择
			 * @param {} record
			 */
			initCurrentUserSelect : function(record){
				record.set('returnerSystemUserId',SCM.CurrentUser.id);
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
					tempString += 'ConsignReturnProductV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (this.searchEndDate.getValue()) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ConsignReturnProductV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'materialMaterialV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if (this.searchCustId.getValue() && this.searchCustId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ConsignReturnProductV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((this.searchStatus.getValue() && this.searchStatus.getValue() != '') || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ConsignReturnProductV.status = \'' + this.searchStatus.getValue() + '\'';
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
				if (e.field == 'bomId') {
					var record = this.MaterialStore.findRecord('id', e.value);
					if (record) {
						e.record.set('materialMaterialModel', record.get('bomModel'));
						e.record.set('unitUnitId', record.get('bomUnitId'));
						e.record.set('unitUnitName', record.get('bomUnitName'));
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
				return '../../scm/control/submitConsignReturnProduct';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackConsignReturnProduct';
			},
			getMainPrintHTML:function(){
				return "<div>"
				+"<div class='caption' >江门市蓬江区富桥旅游用品厂有限公司</div>"
				+"<div class='caption' >委外加工退货单</div>"
				+"<div class='field'  style='width:45%;float:left;'  >单据编号:<span class='dataField' fieldindex='data.number' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>打印时间:<span class='dataField' fieldindex='data.printTime' width=150px ></span></div>"
				+"<div class='field' style='width:45%;float:left;'>加工单位:<span class='dataField' fieldindex='data.processorSupplierName' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>日期:<span class='dataField' fieldindex='data.bizDate' width=150px></span></div>"
				+"<div class='nextLine'></div>"
				+"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>" 
				+"<tr> "
				+"<th bindfield='materialMaterialNumber' width='13%'>货号</th> "
				+"<th bindfield='materialMaterialName' width='28%'>物料名称</th>" 
				+"<th bindfield='materialMaterialModel' width='15%'>规格型号</th> "
				+"<th bindfield='unitUnitName' width='8%'>单位</th> "
				+"<th bindfield='volume' width='12%'>数量</th> "
				+"<th bindfield='price' width='12%'>单价</th> "
				+"<th bindfield='entrysum' width='12%'>金额</th> "
				+"</table>" 
				+"<div class='field' style='width:50%;'></div>"
				+"<div class='field' style='width:30%;float:left;'>退货员:<span class='dataField' fieldindex='data.returnerSystemUserName' width=150px></span></div>"
				+"<div class='field' style='width:30%;float:left;'>供应商确认:</div>"
				+"<div class='field' style='width:80px;float:right;'>第<span class='dataField' fieldindex='data.curPage'></span>页/共<span class='dataField' fieldindex='data.totalPages'></span>页</div>"
				+"</div>";
			}
		});