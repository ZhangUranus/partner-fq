Ext.define('SCM.controller.ProductInwarehouse.ProductInwarehouseController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ProductInwarehouse.ListUI', 'ProductInwarehouse.EditUI','ProductInwarehouse.DetailListUI', 'ProductInwarehouse.DetailEditUI'],
			stores : ['ProductInwarehouse.ProductInwarehouseStore', 'ProductInwarehouse.ProductInwarehouseEditStore', 'ProductInwarehouse.ProductInwarehouseEditEntryStore', 'ProductInwarehouse.ProductInwarehouseEntryDetailStore'],
			requires : ['SCM.model.ProductInwarehouse.ProductInwarehouseActionModel'],
			gridTitle : '成品进仓单',
			editName : 'ProductInwarehouseedit',
			editStoreName : 'ProductInwarehouseEditStore',
			entityName : 'ProductInwarehouse',
			modelName : 'ProductInwarehouseEditModel',
			entryModelName : 'ProductInwarehouseEditEntryModel',
			actionModelName : 'ProductInwarehouseActionModel',
			init : function() {
				this.control({
							'ProductInwarehouselist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'ProductInwarehouselist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'ProductInwarehouselist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'ProductInwarehouselist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ProductInwarehouselist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductInwarehouselist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'ProductInwarehouselist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表反审核按钮
							'ProductInwarehouselist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'ProductInwarehouselist button[action=print]' : {
								click : this.print
							},
							//列表导出
							'ProductInwarehouselist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'ProductInwarehouseedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ProductInwarehouseedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},
							// 查看分录耗料明细
							'ProductInwarehouseedit gridpanel button[action=viewDetail]' : {
								click : this.viewDetailList
							},
							// 编辑界面分录额外耗料明细
							'ProductInwarehouseedit gridpanel button[action=editDetail]' : {
								click : this.editDetailRecord
							},
							// 编辑界面直接提交
							'ProductInwarehouseedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'ProductInwarehouseedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'ProductInwarehouseedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'ProductInwarehouseedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ProductInwarehouseedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'ProductInwarehouseedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'ProductInwarehouseedit grid' : {
								selectionchange : this.fieldChange
							},
							//耗料明细添加行
							'ProductInwarehousedetailedit button[action=addLine]':{
								click:this.detailAddLine
							},
							//耗料明细删除行
							'ProductInwarehousedetailedit button[action=deleteLine]':{
								click:this.detailRemoveLine
							},
							// 耗料明细界面取消
							'ProductInwarehousedetailedit button[action=cancel]' : {
								click : this.cancelDetail
							},
							// 耗料明细界面保存
							'ProductInwarehousedetailedit button[action=save]' : {
								click : this.saveDetailRecord
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
				this.allColumn = this.editEntry.query('gridcolumn');
				this.addLineButton = this.win.down('gridpanel button[action=addLine]');
				this.deleteLineButton = this.win.down('gridpanel button[action=deleteLine]');
				this.MaterialStore = Ext.data.StoreManager.lookup('MBAllStore');
				this.MaterialStore.load();
				
				// 耗料明细页面
				this.viewDetailButton = this.win.down('gridpanel button[action=viewDetail]');
				this.detailWin = Ext.widget('ProductInwarehousedetaillist');
				this.detailEntry = this.detailWin.down('gridpanel');
				//耗料编辑
				this.editDetailButton = this.win.down('gridpanel button[action=editDetail]');
				this.detailEditWin = Ext.widget('ProductInwarehousedetailedit');
				this.detailEditEntry = this.detailEditWin.down('gridpanel');
				
				this.detailEditEntry.addListener('edit', this.detailEntryEditAction, this); 
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
							me.MaterialStore.getProxy().extraParams.whereStr = 'TMaterialV.ID = \'' + record.get('materialMaterialId') + '\'';
							me.MaterialStore.load(function(records, operation, success) {
										me.detailEditEntry.store.remove(me.detailEditEntry.store.data.items);
										for (var i = 0; i < records.length; i++) {
											var tempRecord = records[i];
											var entryRecord = Ext.create('ProductInwarehouseEntryDetailModel');
											entryRecord.phantom = true;
		
											// 设置父id
											entryRecord.set('parentId', record.get('id'));
											entryRecord.set('materialId', tempRecord.get('bomMaterialId'));
											entryRecord.set('model', tempRecord.get('bomMaterialModel'));
											entryRecord.set('quantity', tempRecord.get('volume') * materialVolume);
											entryRecord.set('unitUnitId', tempRecord.get('bomUnitId'));
											entryRecord.set('price', 0);
											entryRecord.set('amount', 0);
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
					Ext.Ajax.request({ 
						scope : this,
						url : "../../scm/control/checkExist",
						params:{entity:'ProductInwarehouseEntry',id:record.get('id')},
						success : function(response, option) {
							if(response.responseText.length<1){
								showError('系统没有返回结果');
							}
				 			var responseArray = Ext.JSON.decode(response.responseText);
				 			if(responseArray.success){
				 				if(responseArray.isExist){
				 				// 如果单据状态是已提交、已审核或者已经结算则不能修改
									this.modifyDetailRecord(this.editEntry, record);
				 				}else{
				 					showError('请先保存!');
				 				}
				 			}else{
				 				showError(responseArray.message);
				 			}
						}
					});
					
				} else {
					showWarning('未选中物料！');
				}
			},
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if(this.searchStartDate.getValue()){
					tempString += 'ProductInwarehouseV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if(this.searchEndDate.getValue()){
					if(tempString != ''){
						if(this.searchStartDate.getRawValue()>this.searchEndDate.getRawValue()){
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return ;
						}
						tempString += ' and ';
					}
					tempString += 'ProductInwarehouseV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if(this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'ProductInwarehouseEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if(this.searchCustId.getValue() && this.searchCustId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'ProductInwarehouseV.supplier_supplier_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((this.searchStatus.getValue() && this.searchStatus.getValue() != '') || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductInwarehouseV.status = \'' + this.searchStatus.getValue() + '\'';
				}
				this.listPanel.store.getProxy().extraParams.whereStr = tempString;
				this.listPanel.store.load();
				this.detailPanel.store.removeAll();
				this.changeComponentsState();
			},
			/**
			 * 添加耗料记录
			 */
			detailAddLine:function(){
				var detailRecord = Ext.create('ProductInwarehouseEntryDetailModel');
				detailRecord.phantom = true;
				// 设置父id
				detailRecord.set('parentId', this.currentRecord.get('id'));
				//默认单价，金额为零
				detailRecord.set('price', 0);
				detailRecord.set('amount', 0);
				this.detailEditEntry.store.add(detailRecord);
			},
			/**
			 * 删除耗料记录
			 */
			detailRemoveLine:function(){
				var selMod = this.detailEditEntry.getSelectionModel();
				if (selMod != null&&selMod.getLastSelected()!=null) {
					this.detailEditEntry.store.remove(selMod.getLastSelected());
				}else{
					showWarning('请选择分录');
				}
				
			},
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
			/**
			 * 当用户编辑grid时，同步更新相关表单数据
			 * 
			 * @param {}
			 *            editor
			 * @param {}
			 *            e
			 */
			initMaterialInfo : function(editor, e) {
				var me = this;
				if (e.field == 'barcode1' || e.field == 'barcode2') {
					if(!Ext.isEmpty(e.record.get('barcode1')) && !Ext.isEmpty(e.record.get('barcode2'))){
						var barcode = Ext.create('SCM.extend.utils.Barcode', e.record.get('barcode1'), e.record.get('barcode2'));
						var pWeek = barcode.getProductWeek();
						var quantity = barcode.getQuantity();
						e.record.set('productWeek',pWeek);
						e.record.set('qantity',quantity);
						
						//获取产品编码
						Ext.Ajax.request({
									scope : me,
									params : {
										ikeaId : barcode.getCodeForIkea(),
										qantity : barcode.getQuantity()
									},
									url : '../../scm/control/getMaterialIdByIkea',
									success : function(response, option) {
										var result = Ext.decode(response.responseText)
										if (result.success) {
											e.record.set('materialMaterialId', result.materialId);
											var record = me.MaterialStore.findRecord('materialId', result.materialId);
											if (record) {
												e.record.set('materialModel', record.get('bomModel'));
												e.record.set('unitUnitId', record.get('bomUnitId'));
											}
										} else {
											showError('获取产品编码失败！');
										}
									}
								});
					}
				} else if (e.field == 'materialMaterialId' ) {
					var record = me.MaterialStore.findRecord('materialId', e.value);
					if (record) {
						e.record.set('materialModel', record.get('bomModel'));
						e.record.set('unitUnitId', record.get('bomUnitId'));
					}
				}
			},
			/**
			 * 初始化用户选择
			 * @param {} record
			 */
			initCurrentUserSelect : function(record){
				record.set('inspectorSystemUserId',SCM.CurrentUser.id);
			},
			/**
			 * 耗料明细编辑事情
			 */
			detailEntryEditAction : function(editor, e){
				//自动填写规格型号和计量单位
				if (e.field == 'materialId') {
					var record = this.searchMaterialId.store.findRecord('id', e.value);
					if (record) {
						e.record.set('model', record.get('model'));
						e.record.set('unitUnitId', record.get('defaultUnitId'));

					}
				}
			},

			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function(){
				return '../../scm/control/submitProductInwarehouse';
			},
			
			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function(){
				return '../../scm/control/rollbackProductInwarehouse';
			}
		});