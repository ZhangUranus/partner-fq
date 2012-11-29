Ext.define('SCM.controller.rpt.BarcodeInwarehouseQryController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.bcq.BarcodeInwarehouseUI'],
			stores : ['rpt.BarcodeInwarehouseQryStore'],
			models : ['rpt.BarcodeInwarehouseQryModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'BarcodeInwarehouseUI' : {
								afterrender : this.initComponent
							},
							// 列表界面刷新
							'BarcodeInwarehouseUI button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'BarcodeInwarehouseUI button[action=export]' : {
								click : this.exportExcel
							}
						});
			},

			/**
			 * 页面初始化方法
			 * 
			 * @param {}
			 *            grid 事件触发控件
			 */
			initComponent : function(view) {
				this.listPanel = view.down('gridpanel[region=center]');
				this.searchWeek = view.down('textfield[name=week]');
				this.ikeaNumber = view.down('textfield[name=IKeaNumber]');
				this.materialName = view.down('textfield[name=materialName]');
				this.barcode = view.down('textfield[name=barcode]');
//				this.listPanel.store.removeAll(true);
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				if (!Ext.isEmpty(this.searchWeek.getValue())) {
					this.listPanel.store.getProxy().extraParams.week = this.searchWeek.getValue();
				} else {
					showWarning('请输入生产周！');
					return;
				}
				if (!Ext.isEmpty(this.ikeaNumber.getValue())) {
					this.listPanel.store.getProxy().extraParams.ikeaNumber = this.ikeaNumber.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.ikeaNumber = "";
				}
				if (!Ext.isEmpty(this.materialName.getValue())) {
					this.listPanel.store.getProxy().extraParams.materialName = this.materialName.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.materialName = "";
				}
				if (!Ext.isEmpty(this.barcode.getValue())) {
					this.listPanel.store.getProxy().extraParams.barcode = this.barcode.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.barcode = "";
				}
				this.listPanel.store.load();
			}
		});