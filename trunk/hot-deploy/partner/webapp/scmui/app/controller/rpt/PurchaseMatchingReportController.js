Ext.define('SCM.controller.rpt.PurchaseMatchingReportController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.pmr.ListUI'],
			stores : ['rpt.PurchaseMatchingReportStore', 'rpt.PurchaseMatchingChartStore', 'rpt.MonthStore'],
			models : ['rpt.PurchaseMatchingReportModel', 'rpt.PurchaseMatchingChartModel', 'rpt.MonthModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'purchasematchingreport' : {
								afterrender : this.initComponent
							},
							// 列表界面刷新
							'purchasematchingreport button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'purchasematchingreport button[action=export]' : {
								click : this.exportExcel
							},
							// 数据导出
							'purchasematchingreport button[action=exportDetail]' : {
								click : this.exportDetailExcel
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
				this.searchSupplierId = view.down('combogrid[name=searchSupplierId]');
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
					this.chartPanel.store.getProxy().extraParams.year = tempStr[0];
					this.chartPanel.store.getProxy().extraParams.month = tempStr[1];
				} else {
					showWarning('请选择月份！');
					return;
				}
				if (!Ext.isEmpty(this.searchSupplierId.getValue())) {
					this.listPanel.store.getProxy().extraParams.supplier = this.searchSupplierId.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.supplier = "";
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
					params.report = 'PMR';
					params.title = '供应商对数表'; // sheet页名称
					params.header = header; // 表头
					params.dataIndex = dataIndex; // 数据引用
					params.pattern = 'SQL';
					params.type = 'EXCEL';
					return params;
				}
			},
			
			
			/**
			 * 获取报表参数
			 * 
			 * @return {}
			 */
			getDetailParams : function() {
				var tempheader = this.listPanel.headerCt.query('{isVisible()}');
				var header = "日期,单据类型,单据编码,供应商名称,提交人,仓库名称,加工件名称,单位,数量,单价,金额";
				var dataIndex = "BIZ_DATE,NAME,NUMBER,SUPPLIER_NAME,USER_NAME,WAREHOUSE_NAME,MATERIAL_NAME,UNIT_NAME,VOLUME,PRICE,ENTRY_SUM";
				
				with (this.listPanel.store) {
					var params = getProxy().extraParams;

					// 页面参数
					params.report = 'PMRD';
					params.title = '供应商对数明细表'; // sheet页名称
					params.header = header; // 表头
					params.dataIndex = dataIndex; // 数据引用
					params.pattern = 'SQL';
					params.type = 'EXCEL';
					return params;
				}
			}
		});