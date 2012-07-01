Ext.define('SCM.controller.basedata.WorkshopController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.workshop.ListUI', 'basedata.workshop.EditUI'],
			stores : ['basedata.WorkshopStore'],
			gridTitle : '车间',
			gridName : 'workshoplist',
			editName : 'workshopedit',
			modelName : 'WorkshopModel',
			entityName : 'Workshop',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							'workshoplist' : {
								afterrender : this.initComponent, // 在界面完成初始化后调用
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'workshoplist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'workshoplist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'workshoplist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'workshoplist button[action=search]' : {
								click : this.refreshRecord
							},
							'workshoplist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'workshopedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'workshopedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'workshopedit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'workshopedit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'workshopedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
				
				//初始化STORE
				Ext.create('WorkshopStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'WSComboStore'		//下拉框－－选择时使用
				});
				
				Ext.create('WorkshopStore', {
				    storeId: 'WSComboInitStore'		//下拉框－－展现时使用
				});
				
			}
		});