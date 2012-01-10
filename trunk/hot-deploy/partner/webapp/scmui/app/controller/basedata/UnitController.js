Ext.define('SCM.controller.basedata.UnitController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.unit.ListUI', 'basedata.unit.EditUI'],
			stores : ['basedata.UnitStore'],
			gridTitle : '计量单位',
			gridName : 'unitlist',
			editName : 'unitedit',
			modelName : 'UnitModel',
			entityName : 'Unit',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							'unitlist' : {
								afterrender : this.initComponent, // 在界面完成初始化后调用
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'unitlist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'unitlist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'unitlist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'unitlist button[action=search]' : {
								click : this.refreshRecord
							},
							'unitlist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'unitedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'unitedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'unitedit button[action=cancel]' : {
								click : this.cancel
							},
							// 监听各field值变动事件，只监听可见控件
							'unitedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
			}
		});