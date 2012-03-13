Ext.define('SCM.controller.WorkshopReturnProduct.WorkshopReturnProductController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['WorkshopReturnProduct.ListUI', 'WorkshopReturnProduct.EditUI', 'WorkshopReturnProduct.DetailEditUI'],
			stores : ['WorkshopReturnProduct.WorkshopReturnProductStore', 'WorkshopReturnProduct.WorkshopReturnProductEditStore', 'WorkshopReturnProduct.WorkshopReturnProductEditEntryStore',
					'WorkshopReturnProduct.WorkshopReturnProductDetailStore'],
			requires : ['SCM.model.WorkshopReturnProduct.WorkshopReturnProductActionModel', 'SCM.model.WorkshopReturnProduct.WorkshopReturnProductDetailModel'],
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
							'WorkshopReturnProductedit gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'WorkshopReturnProductedit gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},
							// 编辑界面分录额外耗料明细
							'WorkshopReturnProductedit gridpanel button[action=editDetail]' : {
								click : this.editDetailRecord
							},
							// 编辑额外耗料明细界面分录新增
							'WorkshopReturnProductdetailedit gridpanel button[action=addLine]' : {
								click : this.addDetailLine
							},
							// 编辑额外耗料明细界面分录删除
							'WorkshopReturnProductdetailedit gridpanel button[action=deleteLine]' : {
								click : this.deleteDetailLine
							},
							// 编辑额外耗料明细界面取消
							'WorkshopReturnProductdetailedit button[action=cancel]' : {
								click : this.cancelDetail
							},
							// 编辑额外耗料明细界面保存
							'WorkshopReturnProductdetailedit button[action=save]' : {
								click : this.saveDetailRecord
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
				this.marterialColumn = this.editEntry.down('combocolumn[dataIndex=bomId]');
				this.MaterialStore = Ext.create('SCM.store.basedata.MaterialBomStore');
				this.MaterialStore.load();
				this.gridToolBar = this.editEntry.down('gridedittoolbar');
				this.checkButton = this.win.down('button[action=check]');
				this.addLineButton = this.win.down('gridpanel button[action=addLine]');
				this.deleteLineButton = this.win.down('gridpanel button[action=deleteLine]');
				this.editDetailButton = this.win.down('gridpanel button[action=editDetail]');
				this.checkBill = false;

				// 额外耗料明细页面
				this.detailWin = Ext.widget('WorkshopReturnProductdetailedit');
				this.detailEntry = this.detailWin.down('gridpanel');
				this.detailEntry.addListener('edit', this.initDetailList, this); // 监控列表编辑事件

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
			 * 
			 * @param {}
			 *            isReadOnly
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
					this.addLineButton.setDisabled(false);
					this.deleteLineButton.setDisabled(false);
					this.editDetailButton.setVisible(false);
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
					this.addLineButton.setDisabled(true);
					this.deleteLineButton.setDisabled(true);
					this.editDetailButton.setVisible(true);
				} else {
					this.setFieldsReadOnly(true);
					this.editEntry.setDisabled(true);
					this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
					this.submitEditButton.setDisabled(true);
					this.checkButton.setVisible(false);
					this.addLineButton.setDisabled(false);
					this.deleteLineButton.setDisabled(false);
					this.editDetailButton.setVisible(false);
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
					tempString += 'materialMaterialV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
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
				if (e.field == 'bomId') {
					var record = this.MaterialStore.findRecord('id', e.value);
					if (record) {
						e.record.set('materialMaterialModel', record.get('bomMaterialModel'));
						e.record.set('unitUnitId', record.get('unitId'));
						e.record.set('unitUnitName', record.get('unitName'));
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
			 * 
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
			 * 
			 * @param {}
			 *            record
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
			},

			/**
			 * 当用户编辑grid时，同步更新相关表单数据
			 * 
			 * @param {}
			 *            editor
			 * @param {}
			 *            e
			 */
			initDetailList : function(editor, e) {
				if (e.field == 'materialMaterialId') {
					var record = this.searchMaterialId.store.findRecord('id', e.value);
					if (record) {
						e.record.set('materialMaterialModel', record.get('model'));
						e.record.set('unitUnitId', record.get('defaultUnitId'));
						e.record.set('unitUnitName', record.get('defaultUnitName'));
						e.record.set('price', record.get('defaultPrice'));
					}
				}
				e.record.set('entrysum', e.record.get('price') * e.record.get('volume'));
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
				this.currentRecord = record;
				this.detailWin.uiStatus = 'Modify';
				// 根据选择的id加载编辑界面数据
				this.detailEntryId = record.get('id');

				this.detailEntry.store.getProxy().extraParams.whereStr = "entry_id = '" + this.detailEntryId + "'";
				this.detailEntry.store.load();
				this.detailWin.show();
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
			 * 新增额外耗料
			 * 
			 * @param {}
			 *            button
			 */
			addDetailLine : function(button) {
				var detailRecord = Ext.create('WorkshopReturnProductDetailModel');
				detailRecord.phantom = true;

				// 设置分录id
				detailRecord.set('entryId', this.detailEntryId);
				this.detailEntry.store.add(detailRecord);
			},
			/**
			 * 删除额外耗料
			 * 
			 * @param {}
			 *            button
			 */
			deleteDetailLine : function(button) {
				var selMod = this.detailEntry.getSelectionModel();
				if (selMod != null) {
					this.detailEntry.store.remove(selMod.getLastSelected());
				}
			},

			/**
			 * 保存额外耗料列表
			 * 
			 * @param {}
			 *            button 保存按钮
			 */
			saveDetailRecord : function(button) {
				this.detailEntry.store.sync();
				if (this.detailWin.isVisible()) {
					this.detailWin.close();
				}
			},

			/**
			 * 取消编辑
			 */
			cancelDetail : function() {
				this.detailWin.close();
			},
			getMainPrintHTML:function(){
				return "<div>"
				+"<div class='caption' >江门市蓬江区富桥旅游用品厂有限公司</div>"
				+"<div class='caption' >车间半成品退货单</div>"
				+"<div class='field' >单据编号:<span class='dataField' fieldindex='data.number' width=150px></span></div>"
				+"<div class='field' style='width:25%;float:left;'>退货车间:<span class='dataField' fieldindex='data.workshopWorkshopName' width=150px></span></div>"
				+"<div class='field' style='width:25%;float:left;'>退货员:<span style='width:150px'></span></div>"
				+"<div class='field' align='right' style='width:35%;float:right;'>日期:<span class='dataField' fieldindex='data.bizDate' width=150px></span></div>"
				+"<div class='nextLine'></div>"
				+"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>" 
				+"<tr> "
				+"<th bindfield='materialMaterialNumber'>货号</th>" 
				+"<th bindfield='warehouseWarehouseName'>仓库</th> "
				+"<th bindfield='materialMaterialName'>物料名称</th>" 
				+"<th bindfield='materialMaterialModel'>规格型号</th> "
				+"<th bindfield='volume'>数量</th> "
				+"<th bindfield='unitUnitName'>单位</th> "
				+"<th bindfield='note'>备注</th> "
				+"</tr> "
				+"</table>" 
				+"<div class='field' >质检意见:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;质检人签名:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"
				+"<div class='field' ><span style='font-weight:20px'>□</span>返工 	车间主任签名:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style='font-weight:20px'>□</span>报废  	 车间主任签名:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>"
				+"<div class='field' style='width:50%;'>打印时间:<span class='dataField' fieldindex='data.printTime'></span></div>"
				+"<div class='field' style='width:50%;'>第<span class='dataField' fieldindex='data.curPage'></span>页/共<span class='dataField' fieldindex='data.totalPages'></span>页</div>"
				+"</div>";
			}
		});