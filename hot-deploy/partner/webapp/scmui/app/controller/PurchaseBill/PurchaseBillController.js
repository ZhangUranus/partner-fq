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
							// 列表提交按钮
							'PurchaseBilllist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'PurchaseBilllist button[action=rollback]' : {
								click : this.rollbackBill
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

							// 编辑界面直接提交
							'PurchaseBilledit button[action=submit]' : {
								click : this.saveAndSubmitRecord
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
				this.searchStartDate = this.listPanel.down('datefield[name=searchStartDate]');
				this.searchEndDate = this.listPanel.down('datefield[name=searchEndDate]');
				//this.searchMaterialId = this.listPanel.down('combogrid[name=searchMaterialId]');
				this.searchKeyWord = this.listPanel.down('textfield[name=searchKeyWord]');
				this.MaterialStore = Ext.data.StoreManager.lookup('MAllStore');
				
				this.searchCustId = this.listPanel.down('combogrid[name=searchCustId]');
				this.searchStatus = this.listPanel.down('combobox[name=status]');
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
			 * 
			 * @param {}
			 *            record
			 */
			initCurrentUserSelect : function(record) {
				record.set('buyerSystemUserId', SCM.CurrentUser.id);
				record.set('submitUserId', SCM.CurrentUser.id);
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (!Ext.isEmpty(this.searchStartDate.getValue())) {
					tempString += 'PurchaseBillV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (!Ext.isEmpty(this.searchEndDate.getValue())) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'PurchaseBillV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
//				if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
//					if (tempString != '') {
//						tempString += ' and ';
//					}
//					tempString += 'PurchaseBillEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
//				}
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
					tempString += 'PurchaseBillV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((!Ext.isEmpty(this.searchStatus.getValue())) || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'PurchaseBillV.status = \'' + this.searchStatus.getValue() + '\'';
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
			hasAuditPermission : function(id) {
				var record = this.submitUserFields.store.findRecord("id", id);
				if (SCM.CurrentUser.departmentId == record.get("departmentId")) {
					return true;
				}
				return false;
			},

			/**
			 * 审核单据
			 * 
			 * @param {}
			 *            button
			 */
			auditBill : function(button) {
				sm = this.listPanel.getSelectionModel();

				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					if (!this.hasAuditPermission(record.get("submitUserId"))) {
						showError('您没有权限审核该小组采购单！');
						return;
					}
					if (record.get('status') == '0') {
						showError('单据未提交，无法进行审核！');
						return;
					}
					if (record.get('status') != '4') {
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
					if (!this.hasAuditPermission(record.get("submitUserId"))) {
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
							/* 判断是否可提交 */
							if (this.hasSubmitLock()) {
								this.getSubmitLock();// 获取提交锁
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
												this.releaseSubmitLock();
											}
										});
							} else {
								showWarning('上一次操作还未完成，请稍等！');
							}
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
				/* 判断是否可提交 */
				if (this.hasSubmitLock()) {
					this.getSubmitLock();// 获取提交锁
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
									this.releaseSubmitLock();
								}
							});
				} else {
					showWarning('上一次操作还未完成，请稍等！');
				}
			},

			/**
			 * 审批界面取消
			 */
			approverCancel : function() {
				this.approverNote.setValue('');
				this.approverStatus.setValue('');
				this.approverWin.close();
			},

			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitPurchaseBill';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackPurchaseBill';
			},

			getMainPrintHTML : function() {
				return "<div>" +
				"<div class='caption' >江门市富桥旅游用品厂有限公司</div>"+							
				"<div class='caption'>Purchasing Order 采购回笼单	</div>"+						
				"<div class='caption'>江门市潮连卢边工业区				</div>"+				
				"<div class='caption'>Tel: 0750-3720617     Fax: 0750-3722789</div>"+								
				"<div style='width:50%;float:left;'>供应商名称:<span class='dataField' fieldindex='data.supplierSupplierName' ></span></div>	<div style='width:50%;float:left;'>采购单号：<span class='dataField' fieldindex='data.number' ></span></div>"+		
				"<div style='width:50%;float:left;'>地址:<span class='dataField' fieldindex='data.supplierSupplierAddress'></span></div> <div style='width:50%;float:left;'>Revision:</span>	<span class='dataField' fieldindex='data.revision'></span>	</div>"+
				"<div style='width:50%;float:left;'>Tel：<span class='dataField' fieldindex='data.supplierSupplierPhoneNum'></span></div> <div style='width:30%;float:left;'>Fax:<span class='dataField' fieldindex='data.supplierSupplierFaxNum'></span></div><div style='width:20%;float:left;'>联络人:<span class='dataField' fieldindex='data.supplierSupplierLinkman'> </div>"+		
				"<div style='width:100%;float:left;'>送货地点：<span class='dataField' fieldindex='data.deliveryAddr'></span></div>"+								
				"<div style='width:25%;float:left;'>订购日期：<span class='dataField' fieldindex='data.bizDate' ></span></div><div style='width:25%;float:left;'>部门: <span class='dataField' fieldindex='data.buyerDepartmentName' ></span></div> <div style='width:20%;float:left;'>采购员:<span class='dataField' fieldindex='data.buyerSystemUserName'></span></div><div style='width:25%;float:left;'>页数：<span class='dataField' fieldindex='data.curPage'></span> of <span  class='dataField' fieldindex='data.totalPages'></span></div>"+		
				"<div style='width:50%;float:left;'>付款方式：<span class='dataField' fieldindex='data.payType' ></span></div><div style='width:50%;float:left;'>税金：<span class='dataField' fieldindex='data.tax' ></span>					</div>"+
				"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>"+
				"<tr>"+
				"	<th bindfield='sort' type ='string' width='40px'>项次<br>Item</th>"+
				"	<th bindfield='materialMaterialName' width='200px'>描述<br>Description</th>"+
				"	<th bindfield='qualityReq' width='100px'>质量要求<br>Quality Request</th>"+
				"	<th bindfield='unitUnitName' width='30px'>单位<br>Unit</th>"+
				"	<th bindfield='volume' width='30%'>数量<br>Qty.</th>"+
				"	<th bindfield='price' width='30%'>单价<br>Unit Price</th>"+
				"	<th bindfield='entrysum' width='30%'>金额<br>Amount</th>"+
				"	<th bindfield='deliveryDate' width='30%'>交货日期<br>Delivery Date</th>"+
				"	<th bindfield='deliveryQty' width='30%'>交货数量<br>Delivery Qty.</th>"+
				"</tr>"+
				"</table>"+			 				
				"<br>"+
				"1.材质为ISO.R.301.ZuAI4Cu1，并且符合IKEA标准ISO-MAT-0010,含铅量不超过90mg/Kg。<br>"+								
				"2.表面要求符合IKEA要求:ISO-MAT-0066表面要求.								<br>"+
				"3.产品规格按双方确认的图纸和样板.		<br>"+
				"<p>								"+
				 "</div>";
			},
			getLoopPrintHTML: function() {
				return "<div>" +
				"<div class='caption' >江门市富桥旅游用品厂有限公司</div>"+							
				"<div class='caption'>Purchasing Order 采购回笼单	</div>"+						
				"<div class='caption'>江门市潮连卢边工业区				</div>"+				
				"<div class='caption'>Tel: 0750-3720617     Fax: 0750-3722789</div>"+								
				"<div style='width:50%;float:left;'>供应商名称:<span class='dataField' fieldindex='data.supplierSupplierName' ></span></div>	<div style='width:50%;float:left;'>采购单号：<span class='dataField' fieldindex='data.number' ></span></div>"+		
				"<div style='width:50%;float:left;'>地址:<span class='dataField' fieldindex='data.supplierSupplierAddress'></span></div> <div style='width:50%;float:left;'>Revision:</span>	<span class='dataField' fieldindex='data.revision'></span>	</div>"+
				"<div style='width:50%;float:left;'>Tel：<span class='dataField' fieldindex='data.supplierSupplierPhoneNum'></span></div> <div style='width:30%;float:left;'>Fax:<span class='dataField' fieldindex='data.supplierSupplierFaxNum'></span></div><div style='width:20%;float:left;'>联络人:<span class='dataField' fieldindex='data.supplierSupplierLinkman'> </div>"+		
				"<div style='width:100%;float:left;'>送货地点：<span class='dataField' fieldindex='data.deliveryAddr'></span></div>"+								
				"<div style='width:25%;float:left;'>订购日期：<span class='dataField' fieldindex='data.bizDate' ></span></div><div style='width:25%;float:left;'>部门: <span class='dataField' fieldindex='data.buyerDepartmentName' ></span></div> <div style='width:20%;float:left;'>采购员:<span class='dataField' fieldindex='data.buyerSystemUserName'></span></div><div style='width:25%;float:left;'>页数：<span class='dataField' fieldindex='data.curPage'></span> of <span  class='dataField' fieldindex='data.totalPages'></span></div>"+		
				"<div style='width:50%;float:left;'>付款方式：<span class='dataField' fieldindex='data.payType' ></span></div><div style='width:50%;float:left;'>税金：<span class='dataField' fieldindex='data.tax' ></span>					</div>"+
				"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>"+
				"<tr>"+
				"	<th bindfield='sort' type ='string' width='40px'>项次<br>Item</th>"+
				"	<th bindfield='materialMaterialName' width='200px'>描述<br>Description</th>"+
				"	<th bindfield='qualityReq' width='100px'>质量要求<br>Quality Request</th>"+
				"	<th bindfield='unitUnitName' width='30px'>单位<br>Unit</th>"+
				"	<th bindfield='volume' width='30%'>数量<br>Qty.</th>"+
				"	<th bindfield='price' width='30%'>单价<br>Unit Price</th>"+
				"	<th bindfield='entrysum' width='30%'>金额<br>Amount</th>"+
				"	<th bindfield='deliveryDate' width='30%'>交货日期<br>Delivery Date</th>"+
				"	<th bindfield='deliveryQty' width='30%'>交货数量<br>Delivery Qty.</th>"+
				"</tr>"+
				"</table>"+			 				
				"<br>"+
				"1.材质为ISO.R.301.ZuAI4Cu1，并且符合IKEA标准ISO-MAT-0010,含铅量不超过90mg/Kg。<br>"+								
				"2.表面要求符合IKEA要求:ISO-MAT-0066表面要求.								<br>"+
				"3.产品规格按双方确认的图纸和样板.		<br>"+
				"<p>								"+
				 "</div>";
			},
			getTailPrintHTML: function() {
				return "<div>" +
				"<div class='caption' >江门市富桥旅游用品厂有限公司</div>"+							
				"<div class='caption'>Purchasing Order 采购回笼单	</div>"+						
				"<div class='caption'>江门市潮连卢边工业区				</div>"+				
				"<div class='caption'>Tel: 0750-3720617     Fax: 0750-3722789</div>"+								
				"<div style='width:50%;float:left;'>供应商名称:<span class='dataField' fieldindex='data.supplierSupplierName' ></span></div>	<div style='width:50%;float:left;'>采购单号：<span class='dataField' fieldindex='data.number' ></span></div>"+		
				"<div style='width:50%;float:left;'>地址:<span class='dataField' fieldindex='data.supplierSupplierAddress'></span></div> <div style='width:50%;float:left;'>Revision:</span>	<span class='dataField' fieldindex='data.revision'></span>	</div>"+
				"<div style='width:50%;float:left;'>Tel：<span class='dataField' fieldindex='data.supplierSupplierPhoneNum'></span></div> <div style='width:30%;float:left;'>Fax:<span class='dataField' fieldindex='data.supplierSupplierFaxNum'></span></div><div style='width:20%;float:left;'>联络人:<span class='dataField' fieldindex='data.supplierSupplierLinkman'> </div>"+		
				"<div style='width:100%;float:left;'>送货地点：<span class='dataField' fieldindex='data.deliveryAddr'></span></div>"+								
				"<div style='width:25%;float:left;'>订购日期：<span class='dataField' fieldindex='data.bizDate' ></span></div><div style='width:25%;float:left;'>部门: <span class='dataField' fieldindex='data.buyerDepartmentName' ></span></div> <div style='width:20%;float:left;'>采购员:<span class='dataField' fieldindex='data.buyerSystemUserName'></span></div><div style='width:25%;float:left;'>页数：<span class='dataField' fieldindex='data.curPage'></span> of <span  class='dataField' fieldindex='data.totalPages'></span></div>"+		
				"<div style='width:50%;float:left;'>付款方式：<span class='dataField' fieldindex='data.payType' ></span></div><div style='width:50%;float:left;'>税金：<span class='dataField' fieldindex='data.tax' ></span>					</div>"+
				"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>"+
				"<tr>"+
				"	<th bindfield='sort' type ='string' width='40px'>项次<br>Item</th>"+
				"	<th bindfield='materialMaterialName' width='200px'>描述<br>Description</th>"+
				"	<th bindfield='qualityReq' width='100px'>质量要求<br>Quality Request</th>"+
				"	<th bindfield='unitUnitName' width='30px'>单位<br>Unit</th>"+
				"	<th bindfield='volume' width='30%'>数量<br>Qty.</th>"+
				"	<th bindfield='price' width='30%'>单价<br>Unit Price</th>"+
				"	<th bindfield='entrysum' width='30%'>金额<br>Amount</th>"+
				"	<th bindfield='deliveryDate' width='30%'>交货日期<br>Delivery Date</th>"+
				"	<th bindfield='deliveryQty' width='30%'>交货数量<br>Delivery Qty.</th>"+
				"</tr>"+
				"<tr>"+
				"   <td></td>"+
				"   <td></td>"+
				"   <td></td>"+
				"   <td></td>"+
				"   <td></td>"+
				"   <td>RMB</td>"+
				"   <td><span class='dataField' fieldindex='data.totalsum' ></span></td>"+
				"   <td></td>"+
				"   <td></td>"+
				"</tr>"+
				"</table>"+			 				
				"<br>"+
				"1.材质为ISO.R.301.ZuAI4Cu1，并且符合IKEA标准ISO-MAT-0010,含铅量不超过90mg/Kg。<br>"+								
				"2.表面要求符合IKEA要求:ISO-MAT-0066表面要求.								<br>"+
				"3.产品规格按双方确认的图纸和样板.		<br>"+
				"<p>								"+	
				"交易条款：		<br>				"+			
				"一、	交期				<br>				"+
				"	供方依本单之交期或本公司供应部以电话或书面调整之交期交货，若有延误，<br>"+								
				"	按一日扣除该批款              %  。								<br>"+
				"二、	质量								<br>"+
				"	1.依图纸要求。   2.进料检验：依本公司《原材料进仓检验规范》。<br>"+								
				"三、	不合格品处理								<br>"+
				"	1.经检验后之不合格品，应如三日后取回，逾时本公司不负责；<br>"+								
				"	2.如急用需选别，所产生之费用，依本公司之索赔标准计费。		<br>"+						
				"四、	附件						供方代表签名：                               		<br>"+
				"1.请确认后签名回传0750-3722789，TEL：07503720617。				<br>"+					
				"2.未尽之事宜，双方协商解决。							确认日期：2011 年&nbsp;&nbsp;&nbsp;&nbsp;月 &nbsp;&nbsp;&nbsp; 日<br>"+		
				"部门经理签名：			<br>		"+			
				"	Please sign &amp; confirm      Authorized Signature <br>"+	
				 "</div>";
			},
			
			getPrintCfg : function() {
				var cfg = new PrintConfig();
				cfg.loopCount = 14;
				cfg.mainBodyDiv = this.getMainPrintHTML();
				cfg.loopBodyDiv = this.getLoopPrintHTML();
				cfg.tailDiv = this.getTailPrintHTML();
				cfg.useTailWhenOnePage=true;
				return cfg;
			}
		});