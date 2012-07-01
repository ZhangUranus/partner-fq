Ext.define('SCM.controller.WorkshopOtherDrawBill.WorkshopOtherDrawBillController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['WorkshopOtherDrawBill.ListUI', 'WorkshopOtherDrawBill.EditUI'],
			stores : ['WorkshopOtherDrawBill.WorkshopOtherDrawBillStore', 'WorkshopOtherDrawBill.WorkshopOtherDrawBillEditStore', 'WorkshopOtherDrawBill.WorkshopOtherDrawBillEditEntryStore'],
			requires : ['SCM.model.WorkshopOtherDrawBill.WorkshopOtherDrawBillActionModel'],
			gridTitle : '车间其它领料',
			editName : 'WorkshopOtherDrawBilledit',
			editStoreName : 'WorkshopOtherDrawBillEditStore',
			entityName : 'WorkshopOtherDrawBill',
			modelName : 'WorkshopOtherDrawBillEditModel',
			entryModelName : 'WorkshopOtherDrawBillEditEntryModel',
			actionModelName : 'WorkshopOtherDrawBillActionModel',
			init : function() {
				this.control({
							'WorkshopOtherDrawBilllist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'WorkshopOtherDrawBilllist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'WorkshopOtherDrawBilllist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'WorkshopOtherDrawBilllist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'WorkshopOtherDrawBilllist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'WorkshopOtherDrawBilllist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'WorkshopOtherDrawBilllist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表反审核按钮
							'WorkshopOtherDrawBilllist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'WorkshopOtherDrawBilllist button[action=print]' : {
								click : this.print
							},
							//列表导出
							'WorkshopOtherDrawBilllist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'WorkshopOtherDrawBilledit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'WorkshopOtherDrawBilledit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},
							// 编辑界面直接提交
							'WorkshopOtherDrawBilledit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'WorkshopOtherDrawBilledit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'WorkshopOtherDrawBilledit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'WorkshopOtherDrawBilledit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'WorkshopOtherDrawBilledit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'WorkshopOtherDrawBilledit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'WorkshopOtherDrawBilledit grid' : {
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
				this.searchStatus = this.listPanel.down('combobox[name=status]');
			},
			
			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function(){
				return '../../scm/control/submitWorkshopOtherDraw';
			},
			
			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function(){
				return '../../scm/control/rollbackWorkshopOtherDraw';
			},
			
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if(this.searchStartDate.getValue()){
					tempString += 'WorkshopOtherDrawBillV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if(this.searchEndDate.getValue()){
					if(tempString != ''){
						if(this.searchStartDate.getRawValue()>this.searchEndDate.getRawValue()){
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return ;
						}
						tempString += ' and ';
					}
					tempString += 'WorkshopOtherDrawBillV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if(this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'WorkshopOtherDrawBillEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if(this.searchCustId.getValue() && this.searchCustId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'WorkshopOtherDrawBillV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((this.searchStatus.getValue() && this.searchStatus.getValue() != '') || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'WorkshopOtherDrawBillV.status = \'' + this.searchStatus.getValue() + '\'';
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
			getMainPrintHTML:function(){
				return "";
			}

		});