Ext.define('SCM.controller.basedata.WarehouseController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.warehouse.ListUI', 'basedata.warehouse.EditUI'],
			stores : ['basedata.WarehouseStore','basedata.WarehouseTypeStore'],
			gridTitle : '仓库',
			gridName : 'warehouseinfomaintaince',
			editName : 'warehouseedit',
			modelName : 'WarehouseModel',
			entityName : 'WarehouseView',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							'warehouseinfomaintaince' : {
								afterrender : this.initComponent, // 在界面完成初始化后调用
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'warehouseinfomaintaince button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'warehouseinfomaintaince button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'warehouseinfomaintaince button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'warehouseinfomaintaince button[action=search]' : {
								click : this.refreshRecord
							},
							'warehouseinfomaintaince button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'warehouseedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'warehouseedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'warehouseedit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'warehouseedit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'warehouseedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
			},
			/**
			 * 增加this.wsTypeFeild的定义
			 */
			afterInitComponent : function() {
        		this.editForm.down('[name=wsTypeId]').store.load();		//初始下拉框数据
			}
		});