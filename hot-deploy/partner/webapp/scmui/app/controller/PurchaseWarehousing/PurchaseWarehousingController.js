Ext.define('SCM.controller.PurchaseWarehousing.PurchaseWarehousingController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['PurchaseWarehousing.ListUI', 'PurchaseWarehousing.EditUI'],
			stores : ['PurchaseWarehousing.PurchaseWarehousingStore', 'PurchaseWarehousing.PurchaseWarehousingEditStore', 'PurchaseWarehousing.PurchaseWarehousingEditEntryStore'],
			requires : ['SCM.model.PurchaseWarehousing.PurchaseWarehousingActionModel'],
			gridTitle : '采购入库单',
			editName : 'PurchaseWarehousingedit',
			editStoreName : 'PurchaseWarehousingEditStore',
			entityName : 'PurchaseWarehousing',
			modelName : 'PurchaseWarehousingEditModel',
			entryModelName : 'PurchaseWarehousingEditEntryModel',
			actionModelName : 'PurchaseWarehousingActionModel',
			init : function() {
				this.control({
							'PurchaseWarehousinglist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'PurchaseWarehousinglist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'PurchaseWarehousinglist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'PurchaseWarehousinglist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'PurchaseWarehousinglist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'PurchaseWarehousinglist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表提交按钮
							'PurchaseWarehousinglist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'PurchaseWarehousinglist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'PurchaseWarehousinglist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'PurchaseWarehousinglist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'PurchaseWarehousingedit gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'PurchaseWarehousingedit gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面直接提交
							'PurchaseWarehousingedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'PurchaseWarehousingedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'PurchaseWarehousingedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'PurchaseWarehousingedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'PurchaseWarehousingedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'PurchaseWarehousingedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'PurchaseWarehousingedit grid' : {
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
				//this.searchMaterialId = this.listPanel.down('combogrid[name=searchMaterialId]');
				this.searchKeyWord = this.listPanel.down('textfield[name=searchKeyWord]');
				this.MaterialStore = Ext.data.StoreManager.lookup('MAllStore');
				
				this.searchCustId = this.listPanel.down('combogrid[name=searchCustId]');
				this.searchStatus = this.listPanel.down('combobox[name=status]');
				this.totalFields = this.editForm.down('textfield[name=totalsum]');
				this.supplierFields = this.editForm.down('textfield[name=supplierSupplierId]');
				this.supplierFields.addListener('change', this.supplierChange, this);
				this.editEntry.store.proxy.addListener('afterRequest', this.supplierChange, this);
			},
			
			/**
			 * 初始化用户选择
			 * @param {} record
			 */
			initCurrentUserSelect : function(record){
				record.set('buyerSystemUserId',SCM.CurrentUser.id);
				record.set('checkerSystemUserId',SCM.CurrentUser.id);
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (!Ext.isEmpty(this.searchStartDate.getValue())) {
					tempString += 'PurchaseWarehousingV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (!Ext.isEmpty(this.searchEndDate.getValue())) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'PurchaseWarehousingV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
//				if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
//					if (tempString != '') {
//						tempString += ' and ';
//					}
//					tempString += 'PurchaseWarehousingEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
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
					tempString += 'PurchaseWarehousingV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((!Ext.isEmpty(this.searchStatus.getValue())) || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'PurchaseWarehousingV.status = \'' + this.searchStatus.getValue() + '\'';
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
					this.setScheduleVolume(e.record, this.supplierFields.getValue(), e.value);
				}
				e.record.set('entrysum', e.record.get('price') * e.record.get('volume'));
				this.changeMaterialPrice(e.grid.store);
			},

			/**
			 * 计算总金额
			 * 
			 * @param {}
			 *            store
			 */
			changeMaterialPrice : function(store) {
				var count = store.getCount();
				var sum = 0;
				for (var i = 0; i < count; i++) {
					sum += store.getAt(i).get('entrysum');
				}
				this.totalFields.setValue(sum);
			},

			/**
			 * 供应商下拉框选择事件
			 * 
			 * @param {}
			 *            field
			 * @param {}
			 *            newValue
			 * @param {}
			 *            oldValue
			 */
			supplierChange : function() {
				var me = this;
				var count = me.editEntry.store.getCount();
				var sum = 0;
				for (var i = 0; i < count; i++) {
					var tempRecord = me.editEntry.store.getAt(i);
					me.setScheduleVolume(tempRecord, this.supplierFields.getValue(), tempRecord.get('materialMaterialId'))
				}
			},

			/**
			 * 获取某供应商计划采购物料数量
			 * 
			 * @param {}
			 *            record
			 * @param {}
			 *            supplierId
			 * @param {}
			 *            materialId
			 */
			setScheduleVolume : function(record, supplierId, materialId) {
				if (!Ext.isEmpty(supplierId) && !Ext.isEmpty(materialId)) {
					Ext.Ajax.request({
								scope : this,
								params : {
									supplierId : supplierId,
									materialId : materialId
								},
								url : '../../scm/control/getPlanBalance',
								timeout : SCM.shortTimes,
								success : function(response, option) {
									var result = Ext.decode(response.responseText)
									if (result.success) {
										record.set('scheduleVolume', result.count);
									} else {
										showError('获取供应商待验收数量失败！');
									}
								}
							});
				}
			},

			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitInspective';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackInspective';
			},
			getMainPrintHTML:function(){
				return "<div>"
				+"<div class='caption' >江门市蓬江区富桥旅游用品厂有限公司</div>"
				+"<div class='caption' >材料验收单</div>"
				+"<div class='field' style='width:45%;float:left;'>单据编号:<span class='dataField' fieldindex='data.number' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>打印时间:<span class='dataField' fieldindex='data.printTime' width=150px ></span></div>"
				+"<div class='field' style='width:45%;float:left;'>供应商:<span class='dataField' fieldindex='data.supplierSupplierName' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>验收日期:<span class='dataField' fieldindex='data.bizDate' width=150px></span></div>"
				+"<div class='nextLine'></div>"
				+"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>" 
				+"<tr> "
				+"<th bindfield='warehouseWarehouseName' width='10%'>仓库</th>"
				+"<th bindfield='materialMaterialName'  width='28%'>材料名称</th> "
				+"<th bindfield='materialMaterialModel' width='15%'>规格</th> "
				+"<th bindfield='unitUnitName' width='8%'>单位</th>" 
				+"<th bindfield='volume' width='13%'>数量</th> "
				+"<th bindfield='price' width='13%'>单价</th> "
				+"<th bindfield='entrysum' width='13%'>金额</th> "
				+"</tr> "
				+"</table>" 
				+"<div class='field' style='width:30%;float:left;'>验收员:<span class='dataField' fieldindex='data.checkerSystemUserName' width=150px></span></div>"
				+"<div class='field' style='width:80px;float:right;'>第<span class='dataField' fieldindex='data.curPage'></span>页/共<span class='dataField' fieldindex='data.totalPages'></span>页</div>"
				+"</div>";
			},
			getTailPrintHTML:function(){
				return "<div>"
				+"<div class='caption' >江门市蓬江区富桥旅游用品厂有限公司</div>"
				+"<div class='caption' >材料验收单</div>"
				+"<div class='field' style='width:45%;float:left;'>单据编号:<span class='dataField' fieldindex='data.number' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>打印时间:<span class='dataField' fieldindex='data.printTime' width=150px ></span></div>"
				+"<div class='field' style='width:45%;float:left;'>供应商:<span class='dataField' fieldindex='data.supplierSupplierName' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>验收日期:<span class='dataField' fieldindex='data.bizDate' width=150px></span></div>"
				+"<div class='nextLine'></div>"
				+"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>" 
				+"<tr> "
				+"<th bindfield='warehouseWarehouseName' width='10%'>仓库</th>"
				+"<th bindfield='materialMaterialName'  width='28%'>材料名称</th> "
				+"<th bindfield='materialMaterialModel' width='15%'>规格</th> "
				+"<th bindfield='unitUnitName' width='8%'>单位</th>" 
				+"<th bindfield='volume' width='13%'>数量</th> "
				+"<th bindfield='price' width='13%'>单价</th> "
				+"<th bindfield='entrysum' width='13%'>金额</th> "
				+"</tr> "
				+"<tr> "
				+"<td ></th>"
				+"<td >合计：</th> "
				+"<td ></th> "
				+"<td ></th>" 
				+"<td ></th> "
				+"<td ></th> "
				+"<td ><span class='dataField' fieldindex='data.totalsum' width=150px></span></th> "
				+"</tr> "
				+"</table>" 
				+"<div class='field' style='width:30%;float:left;'>验收员:<span class='dataField' fieldindex='data.checkerSystemUserName' width=150px></span></div>"
				+"<div class='field' style='width:80px;float:right;'>第<span class='dataField' fieldindex='data.curPage'></span>页/共<span class='dataField' fieldindex='data.totalPages'></span>页</div>"
				+"</div>";
			},
			getPrintCfg:function(){
				var cfg=new PrintConfig();
				//cfg.loopCount=2;
				cfg.mainBodyDiv=this.getMainPrintHTML();
				cfg.loopBodyDiv=this.getLoopPrintHTML();
				cfg.tailDiv=this.getTailPrintHTML();
				cfg.useTailWhenOnePage=true;
				return cfg;
			}
		});