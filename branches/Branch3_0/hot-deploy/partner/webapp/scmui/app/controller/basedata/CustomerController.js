Ext.define('SCM.controller.basedata.CustomerController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.customer.ListUI', 'basedata.customer.EditUI'],
			stores : ['basedata.CustomerStore'],
			gridTitle : '客户',
			gridName : 'custinfomaintaince',
			editName : 'customeredit',
			modelName : 'CustomerModel',
			entityName : 'Customer',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							'custinfomaintaince' : {
								afterrender : this.initComponent, // 在界面完成初始化后调用
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'custinfomaintaince button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'custinfomaintaince button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'custinfomaintaince button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'custinfomaintaince button[action=search]' : {
								click : this.refreshRecord
							},
							'custinfomaintaince button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'customeredit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'customeredit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'customeredit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'customeredit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'customeredit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
			}
		});