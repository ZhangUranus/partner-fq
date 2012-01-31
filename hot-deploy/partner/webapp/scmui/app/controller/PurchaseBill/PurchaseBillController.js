Ext.define('SCM.controller.PurchaseBill.PurchaseBillController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.controller.BillCommonController'],
			views : ['PurchaseBill.ListUI', 'PurchaseBill.EditUI'],
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
							// 编辑界面分录新增
							'PurchaseBilledit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'PurchaseBilledit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
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
							}
						});
			},
			
			/**
			 * 重新方法，增加查询条件控件的引用
			 */
			afterInitComponent : function() {
				this.searchStartDate = this.listContainer.down('datefield[name=searchStartDate]');
				this.searchEndDate = this.listContainer.down('datefield[name=searchEndDate]');
				this.searchMaterialId = this.listContainer.down('combobox[name=searchMaterialId]');
				this.searchCustId = this.listContainer.down('combobox[name=searchCustId]');
			},
			
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if(this.searchStartDate.getValue()){
					tempString += 'PurchaseBillV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if(this.searchEndDate.getValue()){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'PurchaseBillV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if(this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'PurchaseBillEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if(this.searchCustId.getValue() && this.searchCustId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'PurchaseBillV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
				}
				this.listPanel.store.getProxy().extraParams.whereStr = tempString;
				this.listPanel.store.load();
				this.detailPanel.store.removeAll();
				this.changeComponentsState();
			}

		});