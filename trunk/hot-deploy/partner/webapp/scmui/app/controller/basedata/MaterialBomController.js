Ext.define('SCM.controller.basedata.MaterialBomController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.materialbom.ListUI', 'basedata.materialbom.EditUI'],
			stores : ['basedata.MaterialBomStore', 'basedata.MaterialBomEditStore', 'basedata.MaterialBomEditEntryStore'],
			requires : ['SCM.model.basedata.MaterialBomActionModel', 'SCM.model.basedata.UnitModel'],
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
							// 监听各field值变动事件，只监听可见控件
							'materialbomedit form textfield{isVisible()}' : {
								change : this.fieldChange
							},
							// 编辑界面分录新增
							'materialbomedit  gridpanel button[action=addLine]' : {
								click : this.addLine
							},
							// 编辑界面分录删除
							'materialbomedit  gridpanel button[action=deleteLine]' : {
								click : this.deleteLine
							},
							// 编辑界面物料类别字段选择界面确定
							'#materialbomform-materialId-selWin button[name=btnSure]' : {
								click : this.selectMaterial
							},
							// 编辑界面物料类别字段选择界面取消
							'#materialbomform-materialId-selWin button[name=btnCancel]' : {
								click : cancelSelWin
							},
							// //编辑界面分录物料字段选择界面确定
							'#materialbomform-entryMaterialName-selWin button[name=btnSure]' : {
								click : this.selectEntryMaterial
							},
							// 编辑界面分录物料字段选择界面取消
							'#materialbomform-entryMaterialName-selWin button[name=btnCancel]' : {
								click : cancelSelWin
							},
							// 编辑界面分录计量单位字段选择界面确定
							'#materialbomform-entryUnitName-selWin button[name=btnSure]' : {
								click : this.selectEntryUnit
							},
							// 编辑界面分录计量单位字段选择界面取消
							'#materialbomform-entryUnitName-selWin button[name=btnCancel]' : {
								click : cancelSelWin
							}
						});
			},
			/**
			 * 保存原来方法，重写各方法
			 */
			afterInitComponent : function() {
				this.editGrid = this.win.down('gridpanel');
			},

			/**
			 * 点击新增按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			addNewRecord : function(button) {
				newRecord = Ext.create(this.modelName);// 新增记录
				this.win.uiStatus = 'AddNew';
				this.editForm.loadRecord(newRecord);
				// 清空分录
				this.editGrid.store.removeAll(true);
				this.editGrid.getView().refresh();
				this.showEdit();
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
					// 根据选择的id加载编辑界面数据
					var editStore = Ext.create('MaterialBomEditStore');
					editStore.filter([{
								property : "id",
								value : record.data.id
							}]);
					editStore.load({
								scope : this,
								callback : function(records, operation, success) {
									this.win.uiStatus = 'Modify';
									this.ajustId2Display(this.editForm, records[0]);
									this.editForm.loadRecord(records[0]);
									var entryStore = this.editGrid.store;
									entryStore.removeAll();// 清除记录
									entryStore.filter([{
												property : "parentId",
												value : records[0].id
											}]);// 过滤记录
									entryStore.load();
								}
							});
					this.showEdit();
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
					}
				} else if (this.win.uiStatus == 'AddNew') {// 新增记录
					record = Ext.create(this.modelName);
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
			 * 刷新页面数据
			 * 
			 * @param {}
			 *            button 刷新按钮
			 */
			refreshRecord : function(button) {
				if (this.searchText.getValue()) {
					this.listPanel.store.getProxy().extraParams.whereStr = 'TMaterialV.name like \'%' + this.searchText.getValue() + '%\' or TEntryMaterialV.name like \'%'
							+ this.searchText.getValue() + '%\'';
				} else {
					this.listPanel.store.getProxy().extraParams.whereStr = '';
				}
				this.listPanel.store.load();
				this.changeComponentsState();
			},
			// 表头物料选择框保存
			selectMaterial : function(button) {
				selectValwin(button, 'materialId', this.editForm);
			},
			// 分录物料选择框保存
			selectEntryMaterial : function(button) {
				var sr = this.getSelectedEntry();
				selectValIdAName(button, 'entryMaterialId', 'entryMaterialName', sr);
			},
			// 分录计量单位选择框保存
			selectEntryUnit : function(button) {
				var sr = this.getSelectedEntry();
				selectValIdAName(button, 'entryUnitId', 'entryUnitName', sr);
			},
			// 新增分录
			addLine : function(button) {
				var entryRecord = Ext.create('MaterialBomEditEntryModel');

				// 设置父id
				entryRecord.set('parentId', this.editForm.getValues().id);
				this.editGrid.store.add(entryRecord);
				this.fieldChange();
			},
			// 删除分录
			deleteLine : function(button) {
				this.editGrid.store.remove(this.getSelectedEntry());
			},
			// 获取选择的分录行
			getSelectedEntry : function() {
				var selMod = this.editGrid.getSelectionModel();
				if (selMod != null) {
					return selMod.getLastSelected();
				}
				this.fieldChange();
			},
			// 调整显示字段，将id字段值设置为displayValue字段值
			ajustId2Display : function(form, record) {
				var material = form.down('selectorfield[name=materialId]');
				material.displayValue = record.get('materialName');// 默认物料
			}

		});