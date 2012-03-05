Ext.define('SCM.controller.PurchaseBill.PurchaseBillController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['PurchaseBill.ListUI', 'PurchaseBill.EditUI', 'PurchaseBill.ApproverEditUI'],
			stores : ['PurchaseBill.PurchaseBillStore', 'PurchaseBill.PurchaseBillEditStore', 'PurchaseBill.PurchaseBillEditEntryStore'],
			requires : ['SCM.model.PurchaseBill.PurchaseBillActionModel'],
			gridTitle : '采购单',
			editName : 'PurchaseBilledit',
			editStoreName : 'PurchaseBillEditStore',
			entityName : 'PurchaseBill',
			modelName : 'PurchaseBillEditModel',
			entryModelName : 'PurchaseBillEditEntryModel',
			actionModelName : 'PurchaseBillActionModel',
			init : function() {
				this.control({
							'PurchaseBilllist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'PurchaseBilllist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'PurchaseBilllist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'PurchaseBilllist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'PurchaseBilllist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'PurchaseBilllist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'PurchaseBilllist button[action=audit]' : {
								click : this.auditBill
							},
							// 列表反审核按钮
							'PurchaseBilllist button[action=unaudit]' : {
								click : this.unauditBill
							},
							// 列表打印按钮
							'PurchaseBilllist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'PurchaseBilllist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'PurchaseBilledit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'PurchaseBilledit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面保存
							'PurchaseBilledit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'PurchaseBilledit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'PurchaseBilledit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'PurchaseBilledit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'PurchaseBilledit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'PurchaseBilledit grid' : {
								selectionchange : this.fieldChange
							},
							// 审批界面保存事件
							'purchasebillapproveredit button[action=save]' : {
								click : this.approverSave
							},
							// 审批界面取消事件
							'purchasebillapproveredit button[action=cancel]' : {
								click : this.approverCancel
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
				this.submitUserFields = this.editForm.down('combogrid[name=submitUserId]');
				this.auditButton = this.listContainer.down('button[action=audit]');// 审核按钮
				this.unauditButton = this.listContainer.down('button[action=unaudit]');// 反审核按钮

				this.approverWin = Ext.widget('purchasebillapproveredit');
				this.approverStatus = this.approverWin.down('combobox[name=status]');
				this.approverNote = this.approverWin.down('textarea[name=approverNote]');

			},
			
			/**
			 * 初始化用户选择
			 * @param {} record
			 */
			initCurrentUserSelect : function(record){
				record.set('buyerSystemUserId',SCM.CurrentUser.id);
				record.set('submitUserId',SCM.CurrentUser.id);
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
				} else {
					this.setFieldsReadOnly(true);
					this.editEntry.setDisabled(true);
					this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
				}
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (this.searchStartDate.getValue()) {
					tempString += 'PurchaseBillV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (this.searchEndDate.getValue()) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'PurchaseBillV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'PurchaseBillEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if (this.searchCustId.getValue() && this.searchCustId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'PurchaseBillV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
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
			 * 判断用户是否属于同一部门，属于同一部门才有权限进行审批
			 */
			hasAuditPermission : function(id){
				var record = this.submitUserFields.store.findRecord("id",id);
				if(SCM.CurrentUser.departmentId == record.get("departmentId")){
					return true;
				}
				return false;
			},
			
			/**
			 * 审核单据
			 * @param {} button
			 */ 
			auditBill : function(button) {
				sm = this.listPanel.getSelectionModel();

				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					if(!this.hasAuditPermission(record.get("submitUserId"))){
						showError('您没有权限审核该小组采购单！');
						return;
					}
					if (record.get('status') != '0') {
						showError('单据已审核！');
						return;
					}
					this.approverWin.show();
					this.approverWin.billId = record.get('id');
				}
			},
			// 反审核单据
			unauditBill : function(button) {
				sm = this.listPanel.getSelectionModel();

				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					if(!this.hasAuditPermission(record.get("submitUserId"))){
						showError('您没有权限反审核该小组采购单！');
						return;
					}
					if (!(record.get('status') == '1' || record.get('status') == '2')) {
						showError('单据未审核！');
						return;
					}
					Ext.Msg.confirm('提示', '确定反审核该' + this.gridTitle + '？', confirmChange, this);
					function confirmChange(id) {
						if (id == 'yes') {
							Ext.Ajax.request({
										scope : this,
										params : {
											billId : record.get('id'),
											entity : this.entityName,
											isValid : record.get('status') == '1' ? true : false
										},
										url : '../../scm/control/unauditPurchaseBill',
										success : function(response) {
											var result = Ext.decode(response.responseText)
											if (result.success) {
												Ext.Msg.alert("提示", "反审核成功！");
											} else {
												showError(result.message);
											}
											this.refreshRecord();
										}
									});
						}
					}

				}
			},

			/**
			 * 审批界面保存
			 */
			approverSave : function() {
				if (!this.approverNote.isValid() || !this.approverStatus.isValid()) {
					return;
				}
				Ext.Ajax.request({
							scope : this,
							params : {
								billId : this.approverWin.billId,
								entity : this.entityName,
								approverNote : this.approverNote.getValue(),
								status : this.approverStatus.getValue(),
								isValid : this.approverStatus.getValue() == '1' ? true : false
							},
							url : '../../scm/control/auditPurchaseBill',
							success : function(response) {
								var result = Ext.decode(response.responseText)
								if (result.success) {
									Ext.Msg.alert("提示", "审核成功！");
								} else {
									showError(result.message);
								}
								this.refreshRecord();
								this.approverCancel();
							}
						});
			},

			/**
			 * 审批界面取消
			 */
			approverCancel : function() {
				this.approverNote.setValue('');
				this.approverStatus.setValue('');
				this.approverWin.close();
			},
			getMainPrintHTML:function(){
				return "<div>"
				+"<div class='caption' >江门市蓬江区富桥旅游用品厂有限公司</div>"
				+"<div class='caption' >材料备货计划</div>"
				+"<div class='field' >单据编号:<span class='dataField' fieldindex='data.number' width=150px></span></div>"
				+"<div class='field' style='width:45%;float:left;'>供应商:<span class='dataField' fieldindex='data.supplierSupplierName' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>发出日期:<span class='dataField' fieldindex='data.bizDate' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>采购员:<span class='dataField' fieldindex='data.buyerSystemUserName' width=150px></span></div>"
				+"<div class='field' align='left' style='width:45%;float:left;'>预备交货期:<span class='dataField' fieldindex='data.receiveStamp' width=150px></span></div>"
				+"<div class='nextLine'></div>"
				+"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>" 
				+"<tr> "
				+"<th bindfield='materialMaterialName'>材料名称</th> "
				+"<th bindfield='materialMaterialModel'>规格</th> "
				+"<th bindfield='empty'>质量要求</th> "
				+"<th bindfield='unitUnitName'>单位</th>" 
				+"<th bindfield='volume'>数量</th> "
				+"</tr> "
				+"</table>" 
				+"<div class='field' style='width:30%;float:left;'>供应商确认:</div>"
				+"<div class='field' style='width:50%;'>打印时间:<span class='dataField' fieldindex='data.printTime'></span></div>"
				+"<div class='field' style='width:50%;'>第<span class='dataField' fieldindex='data.curPage'></span>页/共<span class='dataField' fieldindex='data.totalPages'></span>页</div>"
				+"</div>";
			}
		});