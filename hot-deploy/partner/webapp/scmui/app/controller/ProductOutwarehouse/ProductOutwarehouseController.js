Ext.define('SCM.controller.ProductOutwarehouse.ProductOutwarehouseController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.BillCommonController'],
			views : ['ProductOutwarehouse.ListUI', 'ProductOutwarehouse.EditUI'],
			stores : ['ProductOutwarehouse.ProductOutwarehouseStore', 'ProductOutwarehouse.ProductOutwarehouseEditStore', 'ProductOutwarehouse.ProductOutwarehouseEditEntryStore'],
			requires : ['SCM.model.ProductOutwarehouse.ProductOutwarehouseActionModel'],
			gridTitle : '成品出仓单',
			editName : 'ProductOutwarehouseedit',
			editStoreName : 'ProductOutwarehouseEditStore',
			entityName : 'ProductOutwarehouse',
			modelName : 'ProductOutwarehouseEditModel',
			entryModelName : 'ProductOutwarehouseEditEntryModel',
			actionModelName : 'ProductOutwarehouseActionModel',
			init : function() {
				this.control({
							'ProductOutwarehouselist' : {
								afterrender : this.initComponent
							},
							// 列表新增按钮
							'ProductOutwarehouselist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表事件
							'ProductOutwarehouselist gridpanel[region=center]' : {
								select : this.showDetail,
								itemdblclick : this.modifyRecord
							},
							// 列表修改按钮
							'ProductOutwarehouselist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'ProductOutwarehouselist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表界面刷新
							'ProductOutwarehouselist button[action=search]' : {
								click : this.refreshRecord
							},
							// 列表审核按钮
							'ProductOutwarehouselist button[action=submit]' : {
								click : this.submitBill
							},
							// 列表反审核按钮
							'ProductOutwarehouselist button[action=rollback]' : {
								click : this.rollbackBill
							},
							// 列表打印按钮
							'ProductOutwarehouselist button[action=print]' : {
								click : this.print
							},
							//列表导出
							'ProductOutwarehouselist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面分录新增
							'ProductOutwarehouseedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'ProductOutwarehouseedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},

							// 编辑界面直接提交
							'ProductOutwarehouseedit button[action=submit]' : {
								click : this.saveAndSubmitRecord
							},
							// 编辑界面保存
							'ProductOutwarehouseedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面打印
							'ProductOutwarehouseedit button[action=print]' : {
								click : this.print
							},
							// 编辑界面重填
							'ProductOutwarehouseedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'ProductOutwarehouseedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'ProductOutwarehouseedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 角色列表更新事件
							'ProductOutwarehouseedit grid' : {
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
				this.MaterialStore = Ext.data.StoreManager.lookup('MBAllStore');
				this.MaterialStore.load();
			},
			
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				var tempString = '';
				if(this.searchStartDate.getValue()){
					tempString += 'ProductOutwarehouseV.biz_date >= \'' + this.searchStartDate.getRawValue() + ' 00:00:00\'';
				}
				if(this.searchEndDate.getValue()){
					if(tempString != ''){
						if(this.searchStartDate.getRawValue()>this.searchEndDate.getRawValue()){
							showWarning('开始日期不允许大于结束日期，请重新选择！');
							return ;
						}
						tempString += ' and ';
					}
					tempString += 'ProductOutwarehouseV.biz_date <= \'' + this.searchEndDate.getRawValue() + ' 23:59:59\'';
				}
				if(this.searchMaterialId.getValue() && this.searchMaterialId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'ProductOutwarehouseEntryV.material_material_id = \'' + this.searchMaterialId.getValue() + '\'';
				}
				if(this.searchCustId.getValue() && this.searchCustId.getValue() != ''){
					if(tempString != ''){
						tempString += ' and ';
					}
					tempString += 'ProductOutwarehouseEntryV.warehouse_warehouse_id = \'' + this.searchCustId.getValue() + '\'';
				}
				if ((this.searchStatus.getValue() && this.searchStatus.getValue() != '') || this.searchStatus.getValue() == 0) {
					if (tempString != '') {
						tempString += ' and ';
					}
					tempString += 'ProductOutwarehouseV.status = \'' + this.searchStatus.getValue() + '\'';
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
				var me = this;
				if (e.field == 'barcode1' || e.field == 'barcode2') {
					if(!Ext.isEmpty(e.record.get('barcode1')) && !Ext.isEmpty(e.record.get('barcode2'))){
						var barcode = Ext.create('SCM.extend.utils.Barcode', e.record.get('barcode1'), e.record.get('barcode2'));
						var pWeek = barcode.getProductWeek();
						var quantity = barcode.getQuantity();
						e.record.set('prdWeek',pWeek);
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
				}
			},
			
			/**
			 * 根据宜家产品编码，获取物料编码
			 * @param ikeaId 宜家产品编码
			 * @return 物料编码
			 */
			getMaterialIdByIkea : function(ikeaId){
				if (!Ext.isEmpty(ikeaId)) {
					Ext.Ajax.request({
								scope : this,
								params : {
									supplierId : supplierId,
									materialId : materialId
								},
								url : '../../scm/control/getPlanBalance',
								success : function(response, option) {
									var result = Ext.decode(response.responseText)
									if (result.success) {
										record.set('scheduleVolume', result.count);
									} else {
										showError('获取供应商待验收数量失败！');
									}
								}
							});
				}
			},
			
			/**
			 * 获取单据提交URL
			 */
			getSubmitBillUrl : function(){
				return '../../scm/control/submitProductOutwarehouse';
			},
			
			/**
			 * 获取单据撤销URL
			 */
			getRollbackBillUrl : function(){
				return '../../scm/control/rollbackProductOutwarehouse';
			}

		});