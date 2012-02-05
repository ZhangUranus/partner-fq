Ext.define('SCM.controller.PurchaseBill.PurchaseBillController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
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
							//列表导出
							'PurchaseBilllist button[action=export]' : {
								click : this.exportExcel
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
			 * 页面初始化方法
			 * 
			 * @param {}
			 *            grid 事件触发控件
			 */
			initComponent : function(view) {
				this.listContainer = view;
				this.listPanel = view.down('gridpanel[region=center]');// 表头列表
				this.detailPanel = view.down('gridpanel[region=south]');// 明细列表
				this.newButton = view.down('button[action=addNew]');// 新增按钮
				this.deleteButton = view.down('button[action=delete]');// 删除按钮
				this.editButton = view.down('button[action=modify]');// 编辑按钮
				this.auditButton = view.down('button[action=audit]');// 提交按钮
				this.unauditButton = view.down('button[action=unaudit]');// 反审核按钮

				this.listPanel.store.proxy.addListener('afterRequest', this.afterRequest, this); // 监听所有请求回调

				this.getEdit();
				this.initButtonByPermission();
				this.changeComponentsState();
				this.initEnterEvent();
				this.afterInitComponent();
				this.refreshRecord();
				this.searchMaterialId.store.load();			//初始化物料列表
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
			 * 根据用户权限初始化按钮状态
			 * 
			 */
			initButtonByPermission : function() {
				if (this.listContainer.permission.add) {
					this.newButton.setVisible(true);
				} else {
					this.newButton.setVisible(false);
				}
				if (this.listContainer.permission.edit) {
					this.editButton.setVisible(true);
				} else {
					this.editButton.setVisible(false);
				}
				if (this.listContainer.permission.remove) {
					this.deleteButton.setVisible(true);
				} else {
					this.deleteButton.setVisible(false);
				}
				if (this.listContainer.permission.audit) {
					this.auditButton.setVisible(true);
					this.unauditButton.setVisible(true);
				} else {
					this.auditButton.setVisible(false);
					this.unauditButton.setVisible(false);
				}
			},
			
			/**
			 * 用户操作触发改变界面控件状态 如：选中记录
			 */
			changeComponentsState : function() {
				if (this.listPanel.getSelectionModel().hasSelection()) {
					this.deleteButton.setDisabled(false);
					this.editButton.setDisabled(false);
					this.auditButton.setDisabled(false);
					this.unauditButton.setDisabled(false);
				} else {
					this.deleteButton.setDisabled(true);
					this.editButton.setDisabled(true);
					this.auditButton.setDisabled(true);
					this.unauditButton.setDisabled(true);
				}
				if (this.win.uiStatus == 'AddNew') {
					this.saveButton.setVisible(true);
				} else {
					if (this.listContainer.permission.edit) {
						this.saveButton.setVisible(true);
						// Ext.each(this.fields, function(item, index, length)
						// {由初始化状态决定
						// item.setReadOnly(false);
						// })
					} else {
						this.saveButton.setVisible(false);
						this.setFieldsReadOnly(true);
					}
				}
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
						if(this.searchStartDate.getRawValue()>this.searchEndDate.getRawValue()){
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return ;
						}
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
			},
			
			/**
			 * 当用户编辑grid时，同步更新相关表单数据
			 * @param {} editor
			 * @param {} e
			 */
			initMaterialInfo : function(editor,e){
				if(e.field == 'materialMaterialId'){
					var record = this.searchMaterialId.store.findRecord('id',e.value);
					if(record){
						e.record.set('materialMaterialModel',record.get('model'));
						e.record.set('price',record.get('defaultPrice'));
						e.record.set('refPrice',record.get('defaultPrice'));
						e.record.set('unitUnitId',record.get('defaultUnitId'));
						e.record.set('unitUnitName',record.get('defaultUnitName'));
					}
				}
				e.record.set('entrysum',e.record.get('price')*e.record.get('volume'));
				var count = e.grid.store.getCount();
				var sum = 0;
				for(var i =0;i<count;i++){
					sum += e.grid.store.getAt(i).get('entrysum');
				}
				this.totalFields.setValue(sum);
			},
			// 审核单据
			auditBill : function(button) {
				sm = this.listPanel.getSelectionModel();

				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					if (record.get('status') != '0') {
						showError('单据已审核！');
						return;
					}
					Ext.Msg.confirm('提示', '确定审核该' + this.gridTitle + '？', confirmChange, this);
					function confirmChange(id) {
						if (id == 'yes') {
							Ext.Ajax.request({
								scope : this,
								url : '../../scm/control/auditPurchaseBill?billId=' + record.get('id') + '&entity=' + this.entityName,
								success : function(response) {
									this.refreshRecord();
								}
							});
						}
					}
				}
			},
			// 反审核单据
			unauditBill : function(button) {
				sm = this.listPanel.getSelectionModel();

				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					if (record.get('status') == '0') {
						showError('单据未审核！');
						return;
					}
					Ext.Msg.confirm('提示', '确定反审核该' + this.gridTitle + '？', confirmChange, this);
					function confirmChange(id) {
						if (id == 'yes') {
							Ext.Ajax.request({
								scope : this,
								url : '../../scm/control/unauditPurchaseBill?billId=' + record.get('id') + '&entity=' + this.entityName,
								success : function(response) {
									this.refreshRecord();
								}
							});
						}
					}
					
				}
			}


		});