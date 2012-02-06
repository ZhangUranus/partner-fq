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
							//列表导出
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
				this.searchStartDate = this.listContainer.down('datefield[name=searchStartDate]');
				this.searchEndDate = this.listContainer.down('datefield[name=searchEndDate]');
				this.searchMaterialId = this.listContainer.down('combogrid[name=searchMaterialId]');
				this.searchCustId = this.listContainer.down('combogrid[name=searchCustId]');
				this.totalFields = this.editForm.down('textfield[name=totalsum]');
				
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if (this.searchStartDate.getValue()) {
					tempString += 'PurchaseWarehousingV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if (this.searchEndDate.getValue()) {
					if (tempString != '') {
						if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return;
						}
						tempString += ' and ';
					}
					tempString += 'PurchaseWarehousingV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if (this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'PurchaseWarehousingEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if (this.searchCustId.getValue() && this.searchCustId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'PurchaseWarehousingV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
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
				} else if (e.field == 'volume') {
					if (e.record.get('scheduleVolume') < e.record.get('volume')) {
						showWarning('数量不能大于待验收数量，请重新输入！');
						e.record.set('volume', 0);
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
			// 提交单据
			submitBill : function(button) {
				sm = this.listPanel.getSelectionModel();

				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					if (record.get('status') != '0') {
						showWarning('单据已提交！');
						return;
					}
					Ext.Msg.confirm('提示', '确定提交该' + this.gridTitle + '？', confirmChange, this);
					function confirmChange(id) {
						if (id == 'yes') {
							Ext.Ajax.request({
										scope : this,
										params : {
											billId : record.get('id'),
											entity : this.entityName
										},
										url : '../../scm/control/submitInspective',
										success : function(response) {
											this.refreshRecord();
										}
									});
						}
					}
				}
			},
			
			// 撤销单据
			rollbackBill : function(button) {
				sm = this.listPanel.getSelectionModel();

				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					if (record.get('status') != '4') {
						showWarning('单据未提交！');
						return;
					}
					Ext.Msg.confirm('提示', '确定撤销该' + this.gridTitle + '？', confirmChange, this);
					function confirmChange(id) {
						if (id == 'yes') {
							Ext.Ajax.request({
										scope : this,
										params : {
											billId : record.get('id'),
											entity : this.entityName
										},
										url : '../../scm/control/rollbackInspective',
										success : function(response) {
											this.refreshRecord();
										}
									});
						}
					}

				}
			}

		});