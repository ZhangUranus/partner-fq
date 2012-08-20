Ext.define('SCM.controller.WorkshopWarehousing.WorkshopWarehousingController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['WorkshopWarehousing.ListUI', 'WorkshopWarehousing.EditUI', 'WorkshopWarehousing.DetailListUI', 'WorkshopWarehousing.DetailEditUI'],
			stores : ['WorkshopWarehousing.WorkshopWarehousingStore', 'WorkshopWarehousing.WorkshopWarehousingEditStore', 'WorkshopWarehousing.WorkshopWarehousingEditEntryStore',
					'WorkshopWarehousing.WorkshopWarehousingDetailStore', 'WorkshopWarehousing.WorkshopWarehousingEntryDetailStore'],
			requires : ['SCM.model.WorkshopWarehousing.WorkshopWarehousingActionModel', 'SCM.model.WorkshopWarehousing.WorkshopWarehousingEntryDetailModel'],
			gridTitle : '制造入库单',
			editName : 'WorkshopWarehousingedit',
			editStoreName : 'WorkshopWarehousingEditStore',
			entityName : 'WorkshopWarehousing',
			modelName : 'WorkshopWarehousingEditModel',
			entryModelName : 'WorkshopWarehousingEditEntryModel',
			actionModelName : 'WorkshopWarehousingActionModel',
			init : function() {
				this.control({
							'WorkshopWarehousinglist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'WorkshopWarehousinglist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'WorkshopWarehousinglist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'WorkshopWarehousinglist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'WorkshopWarehousinglist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'WorkshopWarehousinglist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表提交按钮
							'WorkshopWarehousinglist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表撤销按钮
							'WorkshopWarehousinglist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'WorkshopWarehousinglist button[action=print]' : {
								click : this.print
							},
							// 列表导出
							'WorkshopWarehousinglist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'WorkshopWarehousingedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'WorkshopWarehousingedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},
							// 查看分录耗料明细
							'WorkshopWarehousingedit gridpanel button[action=viewDetail]' : {
								click : this.viewDetailList
							},
							// 编辑界面分录额外耗料明细
							'WorkshopWarehousingedit gridpanel button[action=editDetail]' : {
								click : this.editDetailRecord
							},
							// // 编辑额外耗料明细界面分录新增
							// 'WorkshopWarehousingdetailedit gridpanel
							// button[action=addLine]' : {
							// click : this.addDetailLine
							// },
							// // 编辑额外耗料明细界面分录删除
							// 'WorkshopWarehousingdetailedit gridpanel
							// button[action=deleteLine]' : {
							// click : this.deleteDetailLine
							// },
							// 编辑额外耗料明细界面取消
							'WorkshopWarehousingdetailedit button[action=cancel]' : {
								click : this.cancelDetail
							},
							// 编辑额外耗料明细界面保存
							'WorkshopWarehousingdetailedit button[action=save]' : {
								click : this.saveDetailRecord
							},

							// 编辑界面直接提交
							'WorkshopWarehousingedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'WorkshopWarehousingedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'WorkshopWarehousingedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'WorkshopWarehousingedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'WorkshopWarehousingedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'WorkshopWarehousingedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'WorkshopWarehousingedit grid' : {
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
				this.allColumn = this.editEntry.query('gridcolumn');
				this.addLineButton = this.win.down('gridpanel button[action=addLine]');
				this.deleteLineButton = this.win.down('gridpanel button[action=deleteLine]');
				this.MaterialStore = Ext.data.StoreManager.lookup('MBAllStore');
				this.MaterialStore.load();

				// 耗料明细页面
				this.viewDetailButton = this.win.down('gridpanel button[action=viewDetail]');
				this.detailWin = Ext.widget('WorkshopWarehousingdetaillist');
				this.detailEntry = this.detailWin.down('gridpanel');

				// 额外耗料明细界面
				this.editDetailButton = this.win.down('gridpanel button[action=editDetail]');
				this.detailEditWin = Ext.widget('WorkshopWarehousingdetailedit');
				this.detailEditEntry = this.detailEditWin.down('gridpanel');
				// this.detailEditEntry.addListener('edit', this.initDetailList,
				// this); // 监控列表编辑事件
			},

			/**
			 * 初始化用户选择
			 * 
			 * @param {}
			 *            record
			 */
			initCurrentUserSelect : function(record) {
				record.set('checkerSystemUserId', SCM.CurrentUser.id);
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
					this.editDetailButton.setVisible(true);
				} else {
					this.setFieldsReadOnly(true);
					this.setGridEditAble(false);
					this.saveButton.setDisabled(true);
					this.clearButton.setDisabled(true);
					this.submitEditButton.setDisabled(true);
					this.viewDetailButton.setVisible(true);
					this.editDetailButton.setVisible(false);
				}
			},

			/**
			 * 设置分录列表是否可编辑
			 * 
			 * @param {}
			 *            editAble
			 */
			setGridEditAble : function(editAble) {
				this.addLineButton.setDisabled(!editAble);
				this.deleteLineButton.setDisabled(!editAble);
				Ext.each(this.allColumn, function(item, index, length) {
							if (item.getEditor()) {
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
					tempString += 'WorkshopWarehousingV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (this.searchEndDate.getValue()) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'WorkshopWarehousingV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
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
					tempString += 'WorkshopWarehousingV.workshop_workshop_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((this.searchStatus.getValue() && this.searchStatus.getValue() != '') || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'WorkshopWarehousingV.status = \'' + this.searchStatus.getValue() + '\'';
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
					if (e.originalValue != e.value) {
						Ext.Ajax.request({
									params : {
										entryId : e.record.get('id')
									},
									url : '../../scm/control/removeWorkshopPriceDetail',
									success : function(response, option) {
										var result = Ext.decode(response.responseText)
										if (result.success) {
											Ext.Msg.alert("提示", "由于变更加工件，已经成功清理原来加工件耗料列表！");
										} else {
											showError(result.message);
										}
									}
								});
					}
				}
			},

			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function() {
				return '../../scm/control/submitWorkshopWarehousing';
			},

			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function() {
				return '../../scm/control/rollbackWorkshopWarehousing';
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

			// /**
			// * 当用户编辑grid时，同步更新相关表单数据
			// *
			// * @param {}
			// * editor
			// * @param {}
			// * e
			// */
			// initDetailList : function(editor, e) {
			// if (e.field == 'materialMaterialId') {
			// var record = this.searchMaterialId.store.findRecord('id',
			// e.value);
			// if (record) {
			// e.record.set('materialMaterialModel', record.get('model'));
			// e.record.set('unitUnitId', record.get('defaultUnitId'));
			// e.record.set('unitUnitName', record.get('defaultUnitName'));
			// e.record.set('price', record.get('defaultPrice'));
			// }
			// }
			// e.record.set('entrysum', e.record.get('price') *
			// e.record.get('volume'));
			// },

			/**
			 * 编辑事件
			 * 
			 * @param {}
			 *            grid 当前表格
			 * @param {}
			 *            record 选中记录
			 */
			modifyDetailRecord : function(grid, record) {
				var me = this;
				me.currentRecord = record;
				me.detailEditWin.uiStatus = 'Modify';
				
				var materialVolume = 1;
				if( record.get('volume') != 0 ) {
					materialVolume = record.get('volume');
				}
				
				// 获取耗料列表
				me.detailEditEntry.store.getProxy().extraParams.whereStr = 'parent_id = \'' + record.get('id') + '\'';
				me.detailEditEntry.store.load(function(records, operation, success) {
						if(records.length <= 0){//如果不存在耗料列表，获取初始列表
							me.MaterialStore.getProxy().extraParams.whereStr = 'MaterialBomV.id = \'' + record.get('bomId') + '\'';
							me.MaterialStore.load(function(records, operation, success) {
										me.detailEditEntry.store.remove(me.detailEditEntry.store.data.items);
										for (var i = 0; i < records.length; i++) {
											var tempRecord = records[i];
											var entryRecord = Ext.create('WorkshopWarehousingDetailModel');
											entryRecord.phantom = true;
		
											// 设置父id
											entryRecord.set('parentId', record.get('id'));
											entryRecord.set('bomId', record.get('bomId'));
											entryRecord.set('materialId', tempRecord.get('bomMaterialId'));
											entryRecord.set('materialModel', tempRecord.get('bomMaterialModel'));
											entryRecord.set('volume', tempRecord.get('volume') * materialVolume);
											entryRecord.set('price', 0);
											entryRecord.set('entrysum', 0);
											entryRecord.set('materialUnitId', tempRecord.get('unitId'));
											me.detailEditEntry.store.add(entryRecord);
										}
										me.MaterialStore.getProxy().extraParams.whereStr = "";
									});
						}
					}
				);
				me.detailEditEntry.store.getProxy().extraParams.whereStr = "";
				this.detailEditWin.show();
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

			// /**
			// * 新增额外耗料
			// *
			// * @param {}
			// * button
			// */
			// addDetailLine : function(button) {
			// var detailRecord =
			// Ext.create('WorkshopWarehousingEntryDetailModel');
			// detailRecord.phantom = true;
			//
			// // 设置分录id
			// detailRecord.set('entryId', this.detailEditEntryId);
			// this.detailEditEntry.store.add(detailRecord);
			// },
			// /**
			// * 删除额外耗料
			// *
			// * @param {}
			// * button
			// */
			// deleteDetailLine : function(button) {
			// var selMod = this.detailEditEntry.getSelectionModel();
			// if (selMod != null) {
			// this.detailEditEntry.store.remove(selMod.getLastSelected());
			// }
			// },

			/**
			 * 保存额外耗料列表
			 * 
			 * @param {}
			 *            button 保存按钮
			 */
			saveDetailRecord : function(button) {
				var me = this;
				me.detailEditEntry.store.sync({
							callback : function(batch, options) {
								if (!batch.hasException) {
									if (me.detailEditWin.isVisible()) {
										me.detailEditWin.close();
									}
									Ext.Msg.alert("提示", "保存成功！");
								}
							}
						});
			},

			/**
			 * 取消编辑
			 */
			cancelDetail : function() {
				this.detailEditWin.close();
			},
			getMainPrintHTML : function() {
				return "<div>"
						+ "<div class='caption' >江门市蓬江区富桥旅游用品厂有限公司</div>"
						+ "<div class='caption' >车间半成品入库单</div>"
						+ "<div class='field' style='width:45%;float:left;'  >单据编号:<span class='dataField' fieldindex='data.number' width=150px></span></div>"
						+ "<div class='field' align='right' style='width:45%;float:right;'>打印时间:<span class='dataField' fieldindex='data.printTime' width=150px ></span></div>"
						+ "<div class='field' style='width:25%;float:left;'>发货车间:<span class='dataField' fieldindex='data.workshopWorkshopName' width=150px></span></div>"
						+ "<div class='field' style='width:25%;float:left;'>发货人:<span style='width:150px'></span></div>"
						+ "<div class='field' align='right' style='width:35%;float:right;'>日期:<span class='dataField' fieldindex='data.bizDate' width=150px></span></div>"
						+ "<div class='nextLine'></div>"
						+ "<table  cellspacing='0' class='dataEntry' fieldindex='data.entry'>"
						+ "<tr> "
						+ "<th bindfield='materialMaterialNumber' width='13%'>货号</th>"
						+ "<th bindfield='warehouseWarehouseName'>仓库</th> "
						+ "<th bindfield='materialMaterialName' width='28%'>物料名称</th>"
						+ "<th bindfield='materialMaterialModel' width='15%'>规格型号</th> "
						+ "<th bindfield='volume'  width='13%'>数量</th> "
						+ "<th bindfield='unitUnitName' width='8%'>单位</th> "
						+ "<th bindfield='note' width='13%'>备注</th> "
						+ "</tr> "
						+ "</table>"
						+ "<div class='field' style='width:80px;float:right;'>第<span class='dataField' fieldindex='data.curPage'></span>页/共<span class='dataField' fieldindex='data.totalPages'></span>页</div>"
						+ "</div>";
			}
		});