Ext.define('SCM.controller.basedata.DepartmentController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.department.ListUI', 'basedata.department.EditUI'],
			stores : ['basedata.DepartmentStore', 'basedata.DepartmentTreeStore'],
			models : ['basedata.DepartmentTreeModel'],
			gridTitle : '部门资料',
			gridName : 'departmentinfomaintaince',
			editName : 'departmentedit',
			modelName : 'DepartmentModel',
			entityName : 'DepartmentListView',
			
			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 列表事件
							'departmentinfomaintaince' : {
								afterrender : this.initComponent
							},
							// 选择树形节点
							'departmentinfomaintaince treepanel' : {
								select : this.selectNode
							},
							// 列表事件
							'departmentinfomaintaince gridpanel' : {
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'departmentinfomaintaince button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'departmentinfomaintaince button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'departmentinfomaintaince button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'departmentinfomaintaince button[action=search]' : {
								click : this.refreshRecord
							},
							'departmentinfomaintaince button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'departmentedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'departmentedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'departmentedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'departmentedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
			},
			
			/**
			 * 重写空方法
			 */
			afterInitComponent : function() {
				this.treePanel = this.listContainer.down('treepanel');
			},
			
			/**
			 * 刷新页面数据
			 * 
			 * @param {}
			 *            button 刷新按钮
			 */
			refreshRecord : function(button) {
				if (this.searchText.getValue()) {
					this.listPanel.store.getProxy().extraParams.whereStr = 'DepartmentV.NAME like \'%' + this.searchText.getValue() + '%\'';
				} else {
					this.listPanel.store.getProxy().extraParams.whereStr = '';
				}
				this.listPanel.store.load();
				this.treePanel.store.load();
				this.changeComponentsState();
			},
			
			/**
			 * 选择树形节点时，更新列表数据，显示节点及下级数据
			 * @param {} me
			 * @param {} record
			 * @param {} index
			 * @param {} eOpts
			 */
			selectNode : function(me, record, index, eOpts) {
				this.currentRecord = record;
				this.listPanel.store.load({
							params : {
								'whereStr' : 'DepartmentV.id =\'' + record.data.id + '\'  or DepartmentV.parent_Id=\'' + record.data.id + '\''
							}
						});
			},
			
			/**
			 * 点击新增按钮
			 * 
			 * @param {}
			 *            button 按钮控件
			 */
			addNewRecord : function(button) {
				newRecord = Ext.create(this.modelName);// 新增记录
				if (this.currentRecord) {
					newRecord.set('parentId', this.currentRecord.get('id'));
				}
				this.getEdit().uiStatus = 'AddNew';
				this.editForm.getForm().loadRecord(newRecord);
				this.showEdit();
			}
		});