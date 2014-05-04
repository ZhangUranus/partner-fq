Ext.define('SCM.controller.WorkshopReturnMaterial.WorkshopReturnMaterialController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['WorkshopReturnMaterial.ListUI', 'WorkshopReturnMaterial.EditUI'],
			stores : ['WorkshopReturnMaterial.WorkshopReturnMaterialStore', 'WorkshopReturnMaterial.WorkshopReturnMaterialEditStore', 'WorkshopReturnMaterial.WorkshopReturnMaterialEditEntryStore'],
			requires : ['SCM.model.WorkshopReturnMaterial.WorkshopReturnMaterialActionModel'],
			gridTitle : '制造退料单',
			editName : 'WorkshopReturnMaterialedit',
			editStoreName : 'WorkshopReturnMaterialEditStore',
			entityName : 'WorkshopReturnMaterial',
			modelName : 'WorkshopReturnMaterialEditModel',
			entryModelName : 'WorkshopReturnMaterialEditEntryModel',
			actionModelName : 'WorkshopReturnMaterialActionModel',
			init : function() {
				this.control({
							'WorkshopReturnMateriallist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'WorkshopReturnMateriallist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'WorkshopReturnMateriallist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'WorkshopReturnMateriallist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'WorkshopReturnMateriallist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'WorkshopReturnMateriallist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表提交按钮
							'WorkshopReturnMateriallist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'WorkshopReturnMateriallist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'WorkshopReturnMateriallist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'WorkshopReturnMateriallist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'WorkshopReturnMaterialedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'WorkshopReturnMaterialedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面直接提交
							'WorkshopReturnMaterialedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'WorkshopReturnMaterialedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'WorkshopReturnMaterialedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'WorkshopReturnMaterialedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'WorkshopReturnMaterialedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'WorkshopReturnMaterialedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'WorkshopReturnMaterialedit grid' : {
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
//				this.searchMaterialId = this.listPanel.down('combogrid[name=searchMaterialId]');
				this.searchKeyWord = this.listPanel.down('textfield[name=searchKeyWord]');
				this.MaterialStore = Ext.data.StoreManager.lookup('MAllStore');
				
				this.searchCustId = this.listPanel.down('combogrid[name=searchCustId]');
				this.searchStatus = this.listPanel.down('combobox[name=status]');
				this.totalFields = this.editForm.down('textfield[name=totalsum]');
				this.workshopFields = this.editForm.down('combogrid[name=workshopWorkshopId]');
			},
			
			/**
			 * 初始化用户选择
			 * @param {} record
			 */
			initCurrentUserSelect : function(record){
				record.set('checkerSystemUserId',SCM.CurrentUser.id);
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (!Ext.isEmpty(this.searchStartDate.getValue())) {
					tempString += 'WorkshopReturnMaterialV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (!Ext.isEmpty(this.searchEndDate.getValue())) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'WorkshopReturnMaterialV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
//				if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
//					if (tempString != '') {
//						tempString += ' and ';
//					}
//					tempString += 'WorkshopReturnMaterialEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
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
					tempString += 'WorkshopReturnMaterialV.workshop_workshop_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((!Ext.isEmpty(this.searchStatus.getValue())) || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'WorkshopReturnMaterialV.status = \'' + this.searchStatus.getValue() + '\'';
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
						e.record.set('unitUnitId', record.get('defaultUnitId'));
						e.record.set('unitUnitName', record.get('defaultUnitName'));

					}
				}
			},

			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitWorkshopReturnMaterial';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackWorkshopReturnMaterial';
			},
			getMainPrintHTML:function(){
				return "<div>"
				+"<div class='caption' >"+SCM.CompanyName+"</div>"
				+"<div class='caption' >车间退料单</div>"
				+"<div class='field' style='width:45%;float:left;'  >单据编号:<span class='dataField' fieldindex='data.number' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>打印时间:<span class='dataField' fieldindex='data.printTime' width=150px ></span></div>"
				+"<div class='field' style='width:45%;float:left;'>退料车间:<span class='dataField' fieldindex='data.workshopWorkshopName' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>领料日期:<span class='dataField' fieldindex='data.bizDate' width=150px></span></div>"
				+"<div class='nextLine'></div>"
				+"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>" 
				+"<tr> "
				+"<th bindfield='materialMaterialNumber' width='13%'>货号</th>" 
				+"<th bindfield='warehouseWarehouseName'>仓库</th> "
				+"<th bindfield='materialMaterialName' width='28%'>物料名称</th>" 
				+"<th bindfield='materialMaterialModel' width='15%'>规格型号</th> "
				+"<th bindfield='volume'  width='13%'>数量</th> "
				+"<th bindfield='unitUnitName' width='8%'>单位</th> "
				+"<th bindfield='note' width='13%'>备注</th> "
				+"</tr> "
				+"</table>" 
				+"<div style='padding:6px 6px 6px 20px;'>注：如非生产直接用料的领用必须由领料部门开单并经部门主管签名仓库方可发料。</div>"
				+"<div class='field' style='width:25%;float:left;'>退料人:<span width=150px></span></div>"
				+"<div class='field' style='width:25%;float:left;'>仓库主管签名:</div>"
				+"<div class='field' style='width:25%;float:left;'>验收人:<span class='dataField' fieldindex='data.checkerSystemUserName' width=150px></span></div>"
				+"<div class='field' style='width:70%;float:left;'>备注:<span class='dataField' fieldindex='data.note' width=150px></span></div>"
				+"<div class='field' style='width:80px;float:right;'>第<span class='dataField' fieldindex='data.curPage'></span>页/共<span class='dataField' fieldindex='data.totalPages'></span>页</div>"
				+"</div>";
			}
		});