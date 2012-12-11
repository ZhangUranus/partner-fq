Ext.define('SCM.controller.rpt.BarcodeOutwarehouseQryController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.bcq.BarcodeOutwarehouseUI'],
			stores : ['rpt.BarcodeOutwarehouseQryStore'],
			models : ['rpt.BarcodeOutwarehouseQryModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'BarcodeOutwarehouseUI' : {
								afterrender : this.initComponent
							},
							// 列表界面刷新
							'BarcodeOutwarehouseUI button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'BarcodeOutwarehouseUI button[action=export]' : {
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
				this.searchStartDate = view.down('datefield[name=searchStartDate]');
				this.searchEndDate = view.down('datefield[name=searchEndDate]');
				this.ikeaNumber = view.down('textfield[name=IKeaNumber]');
				this.deliveryNumber = view.down('textfield[name=deliveryNumber]');
				this.barcode = view.down('textfield[name=barcode]');
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				
				if (!Ext.isEmpty(this.searchStartDate.getRawValue())) {
					this.listPanel.store.getProxy().extraParams.startDate = this.searchStartDate.getRawValue() + ' 00:00:00';
				} else {
					showWarning('请选择开始日期！');
					return;
				}
				if (!Ext.isEmpty(this.searchEndDate.getRawValue())) {
					this.listPanel.store.getProxy().extraParams.endDate = this.searchEndDate.getRawValue() + ' 23:59:59';
				} else {
					showWarning('请选择结束日期！');
					return;
				}
				if (this.searchStartDate.getRawValue() > this.searchEndDate.getRawValue()) {
					showWarning('开始日期不允许大于结束日期，请重新选择！');
					return;
				}
				
				if (!Ext.isEmpty(this.deliveryNumber.getValue())) {
					this.listPanel.store.getProxy().extraParams.deliveryNumber = this.deliveryNumber.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.deliveryNumber = "";
				}
				
				if (!Ext.isEmpty(this.ikeaNumber.getValue())) {
					this.listPanel.store.getProxy().extraParams.ikeaNumber = this.ikeaNumber.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.ikeaNumber = "";
				}
				this.listPanel.store.loadPage(1);
			},
			/**
			 * 获取报表参数
			 * 
			 * @return {}
			 */
			getParams : function() {
				var tempheader = this.listPanel.headerCt.query('{isVisible()}');
				var header = "";
				var dataIndex = "";
				var count = 0;
				Ext.each(tempheader, function(column, index, length) {
							if (column.xtype != 'rownumberer') {
								if (count != 0) {
									header += ",";
									dataIndex += ",";
								}
								header += column.text;
								dataIndex += column.dataIndex;
								count++;
							}
						});
				
				with (this.listPanel.store) {
					var params = getProxy().extraParams;

					// 页面参数
					params.sort = Ext.encode(getSorters());
					params.report = 'barcodeOut';
					params.title = '出库条码查询'; // sheet页名称
					params.header = header; // 表头
					params.dataIndex = dataIndex; // 数据引用
					params.pattern = 'SQL';
					params.type = 'EXCEL';
					return params;
				}
			}
		});