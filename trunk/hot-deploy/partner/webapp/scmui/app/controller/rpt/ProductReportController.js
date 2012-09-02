Ext.define('SCM.controller.rpt.ProductReportController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.pr.ListUI'],
			stores : ['rpt.ProductReportStore', 'rpt.ProductChartStore'],
			models : ['rpt.ProductReportModel', 'rpt.ProductChartModel', 'rpt.MonthModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'productreport' : {
								afterrender : this.initComponent
							},
							// 列表界面刷新
							'productreport button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'productreport button[action=export]' : {
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
				this.listPanel = view.down('gridpanel');
				this.chartPanel = view.down('panel chart');
				this.searchMonth = view.down('combobox[name=searchMonth]');
				this.searchWarehouseId = view.down('combogrid[name=searchWarehouseId]');
				this.searchKeyWord = view.down('textfield[name=searchKeyWord]');
//				this.searchMaterialId = view.down('combogrid[name=searchMaterialId]');
				this.searchMonth.store.load({
							scope : this,
							callback : function(records, operation, success) {
								this.searchMonth.setValue(records[records.length - 1]);
								this.refreshRecord();
							}
						});
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				if (!Ext.isEmpty(this.searchMonth.getValue())) {
					var tempStr = this.searchMonth.getValue().split('-');
					this.listPanel.store.getProxy().extraParams.year = tempStr[0];
					this.listPanel.store.getProxy().extraParams.month = tempStr[1];
				} else {
					showWarning('请选择月份！');
					return;
				}
				if (!Ext.isEmpty(this.searchWarehouseId.getValue())) {
					this.listPanel.store.getProxy().extraParams.warehouseId = this.searchWarehouseId.getValue();
					this.chartPanel.store.getProxy().extraParams.warehouseId = this.searchWarehouseId.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.warehouseId = "";
					this.chartPanel.store.getProxy().extraParams.warehouseId = "";
				}
//				if (!Ext.isEmpty(this.searchMaterialId.getValue())) {
//					this.listPanel.store.getProxy().extraParams.materialId = this.searchMaterialId.getValue();
//					this.chartPanel.store.getProxy().extraParams.materialId = this.searchMaterialId.getValue();
//				} else {
//					this.listPanel.store.getProxy().extraParams.materialId = "";
//					this.chartPanel.store.getProxy().extraParams.materialId = "";
//				}
				if (!Ext.isEmpty(this.searchKeyWord.getValue())) {
					this.listPanel.store.getProxy().extraParams.keyWord = this.searchKeyWord.getValue();
					this.chartPanel.store.getProxy().extraParams.keyWord = this.searchKeyWord.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.keyWord = "";
					this.chartPanel.store.getProxy().extraParams.materialId = "";
				}
				this.listPanel.store.load();
				this.chartPanel.store.load({
							scope : this,
							callback : function(records, operation, success) {
								if(records.length==0){
									this.chartPanel.setVisible(false);
								} else {
									this.chartPanel.setVisible(true);
									this.chartPanel.redraw();
								}
							}
						});
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
					params.report = 'PR';
					params.title = '成品报表'; // sheet页名称
					params.header = header; // 表头
					params.dataIndex = dataIndex; // 数据引用
					params.pattern = 'SQL';
					params.type = 'EXCEL';
					return params;
				}
			}
		});