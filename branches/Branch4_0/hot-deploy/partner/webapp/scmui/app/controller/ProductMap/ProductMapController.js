Ext.define('SCM.controller.ProductMap.ProductMapController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter', 'SCM.extend.controller.CommonGridController'],
			views : ['ProductMap.ListUI', 'ProductMap.EditUI'],
			stores : ['ProductMap.ProductMapStore'],
			gridTitle : '计量单位',
			gridName : 'productmaplist',
			editName : 'productmapedit',
			modelName : 'ProductMapModel',
			entityName : 'ProductMapView',

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							'productmaplist' : {
								afterrender : this.initComponent, // 在界面完成初始化后调用
								itemdblclick : this.modifyRecord, // 双击列表，弹出编辑界面
								itemclick : this.changeComponentsState
								// 点击列表，改变修改、删除按钮状态
							},
							// 列表新增按钮
							'productmaplist button[action=addNew]' : {
								click : this.addNewRecord
							},
							// 列表修改按钮
							'productmaplist button[action=modify]' : {
								click : this.editRecord
							},
							// 列表删除按钮
							'productmaplist button[action=delete]' : {
								click : this.deleteRecord
							},
							// 列表查询按钮
							'productmaplist button[action=search]' : {
								click : this.refreshRecord
							},
							'productmaplist button[action=export]' : {
								click : this.exportExcel
							},
							// 编辑界面保存
							'productmapedit button[action=save]' : {
								click : this.saveRecord
							},
							// 编辑界面重填
							'productmapedit button[action=clear]' : {
								click : this.clear
							},
							// 编辑界面取消
							'productmapedit button[action=cancel]' : {
								click : this.cancel
							},
							//列表打印按钮
							'productmapedit button[action=print]' : {
								click : this.print
							},
							// 监听各field值变动事件，只监听可见控件
							'productmapedit form textfield{isVisible()}' : {
								change : this.fieldChange
							}
						});
			},
			
			/**
			 * 重写空方法
			 */
			afterInitComponent : function() {
				this.editGridMaterial = this.editForm.down('[name=materialId]');
				this.editGridMaterial.store.load(); // 初始物料下拉框数据
				this.editGridMaterial.initStore.load(); // 初始物料下拉框数据
			}
		});