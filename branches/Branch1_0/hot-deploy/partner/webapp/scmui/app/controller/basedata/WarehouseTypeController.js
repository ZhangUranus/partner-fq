Ext.define('SCM.controller.basedata.WarehouseTypeController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.warehousetype.ListUI', 'basedata.warehousetype.EditUI'],
			stores : ['basedata.WarehouseTypeStore'],
			gridTitle : '仓库类型',
			gridName : 'warehousetypelist',
			editName : 'warehousetypeedit',
			modelName : 'WarehouseTypeModel',
			entityName : 'WarehouseType',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							'warehousetypelist' : {
								afterrender : this.initComponent, // 在界面完成初始化后调用
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'warehousetypelist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'warehousetypelist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'warehousetypelist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'warehousetypelist button[action=search]' : {
								click : this.refreshRecord
							},
							'warehousetypelist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'warehousetypeedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'warehousetypeedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'warehousetypeedit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'warehousetypeedit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'warehousetypeedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
			}
		});