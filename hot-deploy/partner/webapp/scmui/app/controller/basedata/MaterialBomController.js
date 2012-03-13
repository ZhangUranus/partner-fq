Ext.define('SCM.controller.basedata.MaterialBomController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.materialbom.ListUI', 'basedata.materialbom.EditUI'],
			stores : ['basedata.MaterialBomStore', 'basedata.MaterialBomEditStore', 'basedata.MaterialBomEditEntryStore', 'basedata.MaterialBomComboStore'],
			requires : ['SCM.model.basedata.MaterialBomActionModel'],
			gridTitle : 'BOM单',
			gridName : 'bombillinfomaintaince',
			editName : 'materialbomedit',
			modelName : 'MaterialBomEditModel',
			entityName : 'MaterialBomListView',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							'bombillinfomaintaince' : {
								afterrender : this.initComponent, // 在界面完成初始化后调用
								itemdblclick : this.editRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'bombillinfomaintaince button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'bombillinfomaintaince button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'bombillinfomaintaince button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'bombillinfomaintaince button[action=search]' : {
								click : this.refreshRecord
							},
							'bombillinfomaintaince button[action=export]' : {
								click : this.exportExcel
							},
							//核准BOM
							'bombillinfomaintaince button[action=audit]' : {
								click : this.audit
							},
							// 编辑界面保存
							'materialbomedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'materialbomedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'materialbomedit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'materialbomedit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'materialbomedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 表格变动事件
							'materialbomedit gridpanel' : {
								itemclick : this.fieldChange
							},
							// 编辑界面分录新增
							'materialbomedit gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'materialbomedit gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							}
						});
			},
			/**
			 * 重写空方法
			 */
			afterInitComponent : function() {
				this.editGrid = this.win.down('gridpanel');
				this.editGrid.addListener('edit', this.initMaterialInfo, this); // 监控列表编辑事件
				this.materialField = this.editForm.down("textfield[name=materialId]");
				this.editGridMaterial = this.editForm.down('[name=materialId]');
				this.editGridMaterial.store.load(); // 初始物料下拉框数据
			},

			/**
			 * 当用户编辑grid时，同步更新相关表单数据
			 * @param {} editor
			 * @param {} e
			 */
			initMaterialInfo : function(editor, e) {
				if (e.field == 'entryMaterialId') {
					var record = this.editGridMaterial.store.findRecord('id', e.value);
					if (record) {
						e.record.set('entryUnitId', record.get('defaultUnitId'));
						e.record.set('entryUnitName', record.get('defaultUnitName'));
					}
				}
			},

			/**
			 * 点击新增按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			addNewRecord : function(button) {
				newRecord = Ext.create(this.modelName);// 新增记录
				this.changeEditStatus(newRecord);
				newRecord.phantom = true;
				this.win.uiStatus = 'AddNew';
				this.editForm.getForm().loadRecord(newRecord);
				// 清空分录
				this.editGrid.store.removeAll(true);
				this.editGrid.getView().refresh();
				this.showEdit();
			},

			/**
			 * 加载编辑界面表单数据
			 * 
			 * @param {}
			 *            record
			 */
			loadFormRecord : function(record) {
				this.win.uiStatus = 'Modify';
				Ext.create('MaterialBomEditModel').self.load(record.get('id'), {
							scope : this,
							params : {
								'whereStr' : 'MaterialBomV.ID =\'' + record.get('id') + '\''
							},
							success : function(record, operation) {
								this.editForm.getForm().loadRecord(record);
								this.loadGridRecord(record);
							}
						});
			},

			/**
			 * 加载编辑界面表格数据
			 * 
			 * @param {}
			 *            record
			 */
			loadGridRecord : function(record) {
				var editStore = Ext.create('MaterialBomEditStore');
				this.editGrid.store.load({
							scope : this,
							params : {
								'whereStr' : 'MaterialBomEntryV.PARENT_ID =\'' + record.get('id') + '\''
							},
							callback : function(records, operation, success) {
								this.editForm.inited = true;
								this.showEdit();
							}
						});
			},

			/**
			 * 编辑事件
			 * 
			 * @param {}grid
			 *            当前表格
			 * @param {}record
			 *            选中记录
			 */
			editRecord : function(button) {
				sm = this.listPanel.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					record = sm.getLastSelected();
					this.changeEditStatus(record);
					this.loadFormRecord(record);
				}
			},

			/**
			 * 根据状态设置编辑界面状态
			 * 
			 * @param {}
			 *            isReadOnly
			 */
			changeEditStatus : function(record) {
				if (record.get('status') == '0') {
					this.editGrid.setDisabled(false);
					this.materialField.setReadOnly(false);
				} else {
					this.editGrid.setDisabled(true);
					this.materialField.setReadOnly(true);
				}
			},

			/**
			 * 点击删除按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			deleteRecord : function(button) {
				// 清除新增标记
				var newRecords = this.listPanel.store.getNewRecords();
				for (i in newRecords) {
					newRecords[i].phantom = false;
				}
				sm = this.listPanel.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					// 删除选择的记录
					records = sm.getSelection();
					if (records[0].get("status") == 1) {
						Ext.Msg.alert("提示", "该BOM单已核准，不允许删除！");
						return;
					}
					Ext.Msg.confirm('提示', '确定删除该' + this.gridTitle + '？', confirmChange, this);
					function confirmChange(id) {
						if (id == 'yes') {
							this.listPanel.store.remove(records);
							Ext.Msg.alert("提示", "删除成功");
							this.listPanel.store.sync();
						}
					}
				}
			},

			/**
			 * 保存事件
			 * 
			 * @param {}
			 *            button 保存按钮
			 */
			saveRecord : function(button) {
				var values = this.editForm.getValues();
				if (!this.isValidate()) {
					return;
				}
				if (this.win.uiStatus == 'Modify' && !this.win.modifyed) {// 用户未做任何修改，直接关闭编辑框
					this.win.close();
					return;
				}
				var record;
				if (this.win.uiStatus == 'Modify') {// 修改记录
					record = this.editForm.getRecord();
					record.set(values);
					var removed = this.editGrid.store.getRemovedRecords();
					var updated = this.editGrid.store.getUpdatedRecords();
					var newed = this.editGrid.store.getNewRecords();
					if (record.dirty || removed.length > 0 || updated.length > 0 || newed.length > 0) {
						this.commitSave(record, this.editGrid.store);
					} else {
						if (this.win.isVisible()) {
							this.win.close();
						}
					}
				} else if (this.win.uiStatus == 'AddNew') {// 新增记录
					record = Ext.create(this.modelName);
					record.phantom = true;
					record.set(values);

					// 新建一个复合model
					this.commitSave(record, this.editGrid.store);
				}
				this.changeComponentsState();
			},
			/**
			 * 提交保存
			 * 
			 * @param {}
			 *            record
			 * @param {}
			 *            store
			 */
			commitSave : function(record, store) {
				var oneEntryModel = Ext.create('MaterialBomActionModel');
				oneEntryModel.proxy.addListener('afterRequest', this.afterRequest, this); // 监听请求回调
				oneEntryModel = processOneEntryModel(oneEntryModel, record, store);
				oneEntryModel.save();
			},

			/**
			 * 新增分录
			 * 
			 * @param {}
			 *            button
			 */
			addLine : function(button) {
				var entryRecord = Ext.create('MaterialBomEditEntryModel');
				entryRecord.phantom = true;
				// 设置父id
				entryRecord.set('parentId', this.editForm.getValues().id);
				this.editGrid.store.add(entryRecord);
			},
			/**
			 * 删除分录
			 * 
			 * @param {}
			 *            button
			 */
			deleteLine : function(button) {
				this.editGrid.store.remove(this.getSelectedEntry());
			},
			/**
			 * 获取选择的分录行
			 * 
			 * @return {}
			 */
			getSelectedEntry : function() {
				var selMod = this.editGrid.getSelectionModel();
				if (selMod != null) {
					return selMod.getLastSelected();
				}
			},

			/**
			 * 核准BOM单，核准后不允许删除
			 */
			audit : function(button) {
				var me = this;
				sm = this.listPanel.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					// 删除选择的记录
					var record = sm.getLastSelected();
					if (record.get('status') != '0') {
						showWarning('BOM单已核准！');
						return false;
					} else {
						return true;
					}
					Ext.Msg.confirm('提示', '核准的BOM不允许进行删除、修改操作，确定核准该BOM单？', auditConfirm, this);
					function auditConfirm(id) {
						if (id == 'yes') {
							Ext.Ajax.request({
										params : {
											bomId : record.get('id')
										},
										url : '../../scm/control/auditBOMBill',
										success : function(response, option) {
											var result = Ext.decode(response.responseText)
											if (result.success) {
												Ext.Msg.alert("提示", "处理成功！");
											} else {
												showError(result.message);
											}
											me.refreshRecord();
										}
									});
						}
					}
				}
			}
		});