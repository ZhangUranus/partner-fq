Ext.define('SCM.controller.ConsignDrawMaterial.ConsignDrawMaterialController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ConsignDrawMaterial.ListUI', 'ConsignDrawMaterial.EditUI'],
			stores : ['ConsignDrawMaterial.ConsignDrawMaterialStore', 'ConsignDrawMaterial.ConsignDrawMaterialEditStore', 'ConsignDrawMaterial.ConsignDrawMaterialEditEntryStore'],
			requires : ['SCM.model.ConsignDrawMaterial.ConsignDrawMaterialActionModel'],
			gridTitle : '委外领料单',
			editName : 'ConsignDrawMaterialedit',
			editStoreName : 'ConsignDrawMaterialEditStore',
			entityName : 'ConsignDrawMaterial',
			modelName : 'ConsignDrawMaterialEditModel',
			entryModelName : 'ConsignDrawMaterialEditEntryModel',
			actionModelName : 'ConsignDrawMaterialActionModel',
			init : function() {
				this.control({
							'ConsignDrawMateriallist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'ConsignDrawMateriallist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'ConsignDrawMateriallist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'ConsignDrawMateriallist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ConsignDrawMateriallist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ConsignDrawMateriallist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表提交按钮
							'ConsignDrawMateriallist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'ConsignDrawMateriallist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'ConsignDrawMateriallist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'ConsignDrawMateriallist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'ConsignDrawMaterialedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ConsignDrawMaterialedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面直接提交
							'ConsignDrawMaterialedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'ConsignDrawMaterialedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'ConsignDrawMaterialedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'ConsignDrawMaterialedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ConsignDrawMaterialedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'ConsignDrawMaterialedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'ConsignDrawMaterialedit grid' : {
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
				this.totalFields = this.editForm.down('textfield[name=totalsum]');
				this.processedBomIdFields = this.editForm.down('combogrid[name=processedBomId]');
				this.processedBomIdFields.addListener('change', this.initMaterialGrid, this);
				this.materialVolumeFields = this.editForm.down('numberfield[name=materialVolume]');
				this.materialVolumeFields.addListener('change', this.materialVolumeChange, this);
				this.MaterialStore = Ext.create('SCM.store.basedata.MaterialBomStore');
				this.editEntry.store.proxy.addListener('afterRequest', this.changeStockVolume, this);
			},
			
			/**
			 * 初始化用户选择
			 * @param {} record
			 */
			initCurrentUserSelect : function(record){
				record.set('issuerSystemUserId',SCM.CurrentUser.id);
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (this.searchStartDate.getValue()) {
					tempString += 'ConsignDrawMaterialV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (this.searchEndDate.getValue()) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ConsignDrawMaterialV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ConsignDrawMaterialEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if (this.searchCustId.getValue() && this.searchCustId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ConsignDrawMaterialV.processor_supplier_id = \'' + this.searchCustId.getValue() + '\'';
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
				if (e.field == 'warehouseWarehouseId') {
					this.setStockVolume(e.record, e.value, e.record.get('materialMaterialId'));
				}
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
			 * 选择加工件时，初始化物料列表
			 * 
			 * @param {}
			 *            field
			 * @param {}
			 *            newValue
			 * @param {}
			 *            oldValue
			 */
			initMaterialGrid : function(field, newValue, oldValue) {
				var me = this;
				me.MaterialStore.getProxy().extraParams.whereStr = 'MaterialBomV.id = \'' + newValue + '\'';
				me.MaterialStore.load(function(records, operation, success) {
							me.editEntry.store.removeAll();
							for (var i = 0; i < records.length; i++) {
								var materialVolume = me.materialVolumeFields.getValue() ? me.materialVolumeFields.getValue() : 0;
								var tempRecord = records[i];
								var entryRecord = Ext.create(me.entryModelName);
								entryRecord.phantom = true;

								// 设置父id
								entryRecord.set('parentId', me.editForm.getValues().id);
								entryRecord.set('materialMaterialId', tempRecord.get('bomMaterialId'));
								entryRecord.set('materialMaterialName', tempRecord.get('bomMaterialName'));
								entryRecord.set('materialMaterialModel', tempRecord.get('bomMaterialModel'));
								entryRecord.set('perVolume', tempRecord.get('volume'));
								entryRecord.set('volume', materialVolume * tempRecord.get('volume'));
								entryRecord.set('unitUnitId', tempRecord.get('unitId'));
								entryRecord.set('unitUnitName', tempRecord.get('unitName'));
								me.editEntry.store.add(entryRecord);
							}
							me.MaterialStore.getProxy().extraParams.whereStr = "";
						});
			},

			/**
			 * 修改加工件数量时，刷新表格数据
			 */
			materialVolumeChange : function(field, newValue, oldValue) {
				var me = this;
				var count = me.editEntry.store.getCount();
				var materialVolume = newValue ? newValue : 0;
				for (var i = 0; i < count; i++) {
					var tempRecord = me.editEntry.store.getAt(i);
					tempRecord.set('volume', materialVolume * tempRecord.get('perVolume'));
				}
			},
			
			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function(){
				return '../../scm/control/submitConsignDramMaterial';
			},
			
			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function(){
				return '../../scm/control/rollbackConsignDramMaterial';
			},
			getMainPrintHTML:function(){
				return "<div>"
				+"<div class='caption' >江门市蓬江区富桥旅游用品厂有限公司</div>"
				+"<div class='caption' >发外加工单</div>"
				+"<div class='field' style='width:45%;float:left;' >单据编号:<span class='dataField' fieldindex='data.number' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>打印时间:<span class='dataField' fieldindex='data.printTime' width=150px ></span></div>"
				+"<div class='field' style='width:45%;float:left;'>加工单位:<span class='dataField' fieldindex='data.processorSupplierName' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>日期:<span class='dataField' fieldindex='data.bizDate' width=150px></span></div>"
				+"<div class='nextLine'></div>"
				+"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>" 
				+"<tr> "
				+"<th bindfield='warehouseWarehouseName'  width='15%'>仓库</th> "
				+"<th bindfield='materialMaterialName' width='20%'>物料名称</th>" 
				+"<th bindfield='materialMaterialModel' width='20%'>规格型号</th> "
				+"<th bindfield='volume' width='15%'>数量</th> "
				+"<th bindfield='unitUnitName' width='15%'>单位</th> "
				+"<th bindfield='note' width='15%'>备注</th> "
				+"</tr> "
				+"<tr> "
				+"<td >附注：</td> "
				+"<td  colspan='5'><div class='field'>①验收后，有异议，可两天内提出，三天以后，本厂概不负责。</div><div class='field'>②此单可用诉讼依据。</div></td>" 
				+"</tr> "
				+"</table>" 
				+"<div class='field' style='width:50%;'></div>"
				+"<div class='field' style='width:30%;float:left;'>发货员:<span class='dataField' fieldindex='data.issuerSystemUserName' width=150px></span></div>"
				+"<div class='field' style='width:30%;float:left;'>供应商确认:</div>"
				+"<div class='field' style='width:80px;float:right;'>第<span class='dataField' fieldindex='data.curPage'></span>页/共<span class='dataField' fieldindex='data.totalPages'></span>页</div>"
				+"</div>";
			}
		});