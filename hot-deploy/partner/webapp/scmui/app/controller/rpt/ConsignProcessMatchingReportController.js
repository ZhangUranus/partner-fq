Ext.define('SCM.controller.rpt.ConsignProcessMatchingReportController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.cpmr.ListUI'],
			stores : ['rpt.ConsignProcessMatchingReportStore', 'rpt.ConsignProcessMatchingChartStore', 'rpt.MonthStore'],
			models : ['rpt.ConsignProcessMatchingReportModel', 'rpt.ConsignProcessMatchingChartModel', 'rpt.MonthModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'consignprocessmatchingreport' : {
								afterrender : this.initComponent
							},
							// 列表界面刷新
							'consignprocessmatchingreport button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'consignprocessmatchingreport button[action=export]' : {
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
				var tempString = '';
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
				}
				this.listPanel.store.load();
				this.chartPanel.store.load();
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
						})
				with (this.listPanel.store) {
					var params = {
						// Store参数
						sort : Ext.encode(getSorters()),
						filter : Ext.encode(filters.items),

						// 页面参数
						entity : 'VSystemLog', // 导出实体名称，一般为视图名称。
						title : '系统日志', // sheet页名称
						header : header, // 表头
						dataIndex : dataIndex, // 数据引用
						type : 'EXCEL',
						whereStr : getProxy().extraParams.whereStr
					}
					return params;
				}
			}
		});