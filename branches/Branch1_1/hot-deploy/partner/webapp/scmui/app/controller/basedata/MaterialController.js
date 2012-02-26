Ext.define('SCM.controller.basedata.MaterialController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.material.ListUI', 'basedata.material.EditUI'],
			stores : ['basedata.MaterialTypeTreeStore', 'basedata.MaterialTypeStore', 'basedata.MaterialStore'],
			models : ['basedata.MaterialTypeTreeModel'],
			gridTitle : '料品资料',
			gridName : 'materialinfomaintaince',
			editName : 'materialedit',
			modelName : 'MaterialModel',
			entityName : 'TMaterialListView',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 列表事件
							'materialinfomaintaince' : {
								afterrender : this.initComponent
							},
							// 选择树形节点
							'materialinfomaintaince treepanel' : {
								select : this.selectNode
							},
							// 列表事件
							'materialinfomaintaince gridpanel' : {
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'materialinfomaintaince button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'materialinfomaintaince button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'materialinfomaintaince button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'materialinfomaintaince button[action=search]' : {
								click : this.refreshRecord
							},
							'materialinfomaintaince button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'materialedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'materialedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'materialedit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'materialedit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'materialedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
			},

			/**
			 * 重写空方法
			 */
			afterInitComponent : function() {
				this.editForm.down('[name=materialTypeId]').store.load(); // 初始物料下拉框数据
				this.editForm.down('[name=defaultUnitId]').store.load();// 初始计量单位下拉框数据
			},

			/**
			 * 选择树形节点时，更新列表数据
			 * @param {} me
			 * @param {} record
			 * @param {} index
			 * @param {} eOpts
			 */
			selectNode : function(me, record, index, eOpts) {
				this.currentRecord = record;
				this.listPanel.store.load({
							params : {
								'whereStr' : 'TMaterialV.material_Type_Id =\'' + record.get("id") + '\''
							}
						});
			},
			
			/**
			 * 刷新页面数据
			 * 
			 * @param {}
			 *            button 刷新按钮
			 */
			refreshRecord : function(button) {
				if (this.searchText.getValue()) {
					this.listPanel.store.getProxy().extraParams.whereStr = 'TMaterialV.NAME like \'%' + this.searchText.getValue() + '%\'';
				} else {
					this.listPanel.store.getProxy().extraParams.whereStr = '';
				}
				this.listPanel.store.load();
				if(this.treePanel){
					this.treePanel.store.load();
				}
				this.changeComponentsState();
			},

			/**
			 * 点击新增按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			addNewRecord : function(button) {
				newRecord = Ext.create(this.modelName);// 新增记录
				newRecord.phantom = true;
				if (this.currentRecord) {
					newRecord.set('materialTypeId', this.currentRecord.get('id'));
				}
				this.getEdit().uiStatus = 'AddNew';
				this.editForm.getForm().loadRecord(newRecord);
				this.showEdit();
			}
		});