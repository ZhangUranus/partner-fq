Ext.define('SCM.controller.ConsignWarehousing.ConsignWarehousingController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ConsignWarehousing.ListUI', 'ConsignWarehousing.EditUI'],
			stores : ['ConsignWarehousing.ConsignWarehousingStore', 'ConsignWarehousing.ConsignWarehousingEditStore', 'ConsignWarehousing.ConsignWarehousingEditEntryStore'],
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
					tempString += 'ConsignWarehousingEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
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
				if (e.field == 'materialMaterialId') {
					var record = this.searchMaterialId.store.findRecord('id', e.value);
					if (record) {
						e.record.set('materialMaterialModel', record.get('model'));
						e.record.set('unitUnitId', record.get('defaultUnitId'));
						e.record.set('unitUnitName', record.get('defaultUnitName'));
					}
				}
			}
		});