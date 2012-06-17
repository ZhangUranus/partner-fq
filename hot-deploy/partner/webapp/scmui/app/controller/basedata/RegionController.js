Ext.define('SCM.controller.basedata.RegionController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['basedata.region.ListUI', 'basedata.region.EditUI'],
			stores : ['basedata.RegionStore'],
			gridTitle : '地区',
			gridName : 'regionlist',
			editName : 'regionedit',
			modelName : 'RegionModel',
			entityName : 'Region',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							'regionlist' : {
								afterrender : this.initComponent, // 在界面完成初始化后调用
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'regionlist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'regionlist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'regionlist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'regionlist button[action=search]' : {
								click : this.refreshRecord
							},
							'regionlist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'regionedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'regionedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'regionedit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'regionedit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'regionedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
				
				//初始化STORE
				Ext.create('RegionStore', {
					pageSize : SCM.comboPageSize,
				    storeId: 'RGComboStore'			//下拉框－－选择时使用
				});
				Ext.create('RegionStore', {
				    storeId: 'RGComboInitStore'		//下拉框－－展现时使用
				});
			}
		});