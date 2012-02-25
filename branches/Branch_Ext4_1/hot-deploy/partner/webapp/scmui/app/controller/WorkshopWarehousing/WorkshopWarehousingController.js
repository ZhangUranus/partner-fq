Ext.define('SCM.controller.WorkshopWarehousing.WorkshopWarehousingController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['WorkshopWarehousing.ListUI', 'WorkshopWarehousing.EditUI', 'WorkshopWarehousing.DetailListUI'],
			stores : ['WorkshopWarehousing.WorkshopWarehousingStore', 'WorkshopWarehousing.WorkshopWarehousingEditStore', 'WorkshopWarehousing.WorkshopWarehousingEditEntryStore', 'WorkshopWarehousing.WorkshopWarehousingDetailStore'],
			requires : ['SCM.model.WorkshopWarehousing.WorkshopWarehousingActionModel'],
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
				this.searchStartDate = this.listContainer.down('datefield[name=searchStartDate]');
				this.searchEndDate = this.listContainer.down('datefield[name=searchEndDate]');
				this.searchMaterialId = this.listContainer.down('combogrid[name=searchMaterialId]');
				this.searchCustId = this.listContainer.down('combogrid[name=searchCustId]');
				this.allColumn = this.editEntry.query('gridcolumn');
				this.addLineButton = this.win.down('gridpanel button[action=addLine]');
				this.deleteLineButton = this.win.down('gridpanel button[action=deleteLine]');
				
				// 耗料明细页面
				this.viewDetailButton = this.win.down('gridpanel button[action=viewDetail]');
				this.detailWin = Ext.widget('WorkshopWarehousingdetaillist');
				this.detailEntry = this.detailWin.down('gridpanel');
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
					tempString += 'WorkshopWarehousingEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if (this.searchCustId.getValue() && this.searchCustId.getValue() != '') {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'WorkshopWarehousingV.workshop_workshop_id = \'' + this.searchCustId.getValue() + '\'';
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
			getPrintTemplateArr: function(){
				return [{name:'默认打印模板',
					     template:[{dataIndex:'data.number',style:'left:10px;top:50px'}, 
					        	{dataIndex:'data.bizDate',style:'left:150px;top:50px'},
					               {dataIndex:'data.entry[0].materialMaterialName',style:'left:10px;top:80px'}
					                ]
					     }
					     ];
			}
		});