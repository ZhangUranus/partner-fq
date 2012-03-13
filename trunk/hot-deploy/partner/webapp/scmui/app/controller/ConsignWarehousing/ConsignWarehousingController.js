Ext.define('SCM.controller.ConsignWarehousing.ConsignWarehousingController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ConsignWarehousing.ListUI', 'ConsignWarehousing.EditUI', 'ConsignWarehousing.DetailListUI'],
			stores : ['ConsignWarehousing.ConsignWarehousingStore', 'ConsignWarehousing.ConsignWarehousingEditStore', 'ConsignWarehousing.ConsignWarehousingEditEntryStore', 'ConsignWarehousing.ConsignWarehousingDetailStore'],
			requires : ['SCM.model.ConsignWarehousing.ConsignWarehousingActionModel'],
			gridTitle : '委外入库单',
			editName : 'ConsignWarehousingedit',
			editStoreName : 'ConsignWarehousingEditStore',
			entityName : 'ConsignWarehousing',
			modelName : 'ConsignWarehousingEditModel',
			entryModelName : 'ConsignWarehousingEditEntryModel',
			actionModelName : 'ConsignWarehousingActionModel',
			init : function() {
				this.control({
							'ConsignWarehousinglist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'ConsignWarehousinglist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'ConsignWarehousinglist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'ConsignWarehousinglist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ConsignWarehousinglist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ConsignWarehousinglist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表提交按钮
							'ConsignWarehousinglist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'ConsignWarehousinglist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'ConsignWarehousinglist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'ConsignWarehousinglist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'ConsignWarehousingedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ConsignWarehousingedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},
							// 查看分录耗料明细
							'ConsignWarehousingedit gridpanel button[action=viewDetail]' : {
								click : this.viewDetailList
							},

							// 编辑界面直接提交
							'ConsignWarehousingedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'ConsignWarehousingedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'ConsignWarehousingedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'ConsignWarehousingedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ConsignWarehousingedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'ConsignWarehousingedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'ConsignWarehousingedit grid' : {
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
				this.allColumn = this.editEntry.query('gridcolumn');
				this.addLineButton = this.win.down('gridpanel button[action=addLine]');
				this.deleteLineButton = this.win.down('gridpanel button[action=deleteLine]');
				this.MaterialStore = Ext.create('SCM.store.basedata.MaterialBomStore');
				this.MaterialStore.load();
				
				// 耗料明细页面
				this.viewDetailButton = this.win.down('gridpanel button[action=viewDetail]');
				this.detailWin = Ext.widget('ConsignWarehousingdetaillist');
				this.detailEntry = this.detailWin.down('gridpanel');
			},
			
			/**
			 * 初始化用户选择
			 * @param {} record
			 */
			initCurrentUserSelect : function(record){
				record.set('checkerSystemUserId',SCM.CurrentUser.id);
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
					this.setGridEditAble(true);
					this.saveButton.setDisabled(false);
					this.clearButton.setDisabled(false);
					this.submitEditButton.setDisabled(false);
					this.viewDetailButton.setVisible(false);
				} else {
					this.setFieldsReadOnly(true);
					this.setGridEditAble(false);
					this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
					this.submitEditButton.setDisabled(true);
					this.viewDetailButton.setVisible(true);
				}
			},
			
			/**
			 * 设置分录列表是否可编辑
			 * @param {} editAble
			 */
			setGridEditAble : function(editAble){
				this.addLineButton.setDisabled(!editAble);
				this.deleteLineButton.setDisabled(!editAble);
				Ext.each(this.allColumn, function(item, index, length) {
							if(item.getEditor()){
								item.getEditor().setDisabled(!editAble);
							}
						})
			},
			
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (this.searchStartDate.getValue()) {
					tempString += 'ConsignWarehousingV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (this.searchEndDate.getValue()) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'ConsignWarehousingV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
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
					tempString += 'ConsignWarehousingV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
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
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitConsignWarehousing';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackConsignWarehousing';
			},
			
			/**
			 * 查看加工件耗料情况
			 */
			viewDetailList : function() {
				var sm = this.editEntry.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();

					this.detailEntry.store.getProxy().extraParams.whereStr = "parent_id = '" + record.get('id') + "'";
					this.detailEntry.store.load();
					this.detailWin.show();
				} else {
					showWarning('未选中物料！');
				}
				
			},
			getMainPrintHTML:function(){
				return "<div>"
				+"<div class='caption' >江门市蓬江区富桥旅游用品厂有限公司</div>"
				+"<div class='caption' >委外加工验收单</div>"
				+"<div class='field' >单据编号:<span class='dataField' fieldindex='data.number' width=150px></span></div>"
				+"<div class='field' style='width:45%;float:left;'>加工单位:<span class='dataField' fieldindex='data.processorSupplierName' width=150px></span></div>"
				+"<div class='field' align='right' style='width:45%;float:right;'>日期:<span class='dataField' fieldindex='data.bizDate' width=150px></span></div>"
				+"<div class='nextLine'></div>"
				+"<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>" 
				+"<tr> "
				+"<th bindfield='materialMaterialNumber'>货号</th> "
				+"<th bindfield='materialMaterialName'>物料名称</th>" 
				+"<th bindfield='materialMaterialModel'>规格型号</th> "
				+"<th bindfield='unitUnitName'>单位</th> "
				+"<th bindfield='volume'>数量</th> "
				+"<th bindfield='price'>单位</th> "
				+"<th bindfield='entrysum'>金额</th> "
				+"</table>" 
				+"<div class='field' style='width:50%;'></div>"
				+"<div class='field' style='width:30%;float:left;'>验收员:<span class='dataField' fieldindex='data.checkerSystemUserName' width=150px></span></div>"
				+"<div class='field' style='width:30%;float:left;'>供应商确认:</div>"
				+"<div class='field' style='width:50%;'>打印时间:<span class='dataField' fieldindex='data.printTime'></span></div>"
				+"<div class='field' style='width:50%;'>第<span class='dataField' fieldindex='data.curPage'></span>页/共<span class='dataField' fieldindex='data.totalPages'></span>页</div>"
				+"</div>";
			}
		});