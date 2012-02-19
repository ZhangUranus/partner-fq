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
				this.whereStr = '';
				if (!Ext.isEmpty(this.searchMonth.getValue())) {
					var tempStr = this.searchMonth.getValue().split('-');
					this.listPanel.store.getProxy().extraParams.year = tempStr[0];
					this.listPanel.store.getProxy().extraParams.month = tempStr[1];
					this.chartPanel.store.getProxy().extraParams.year = tempStr[0];
					this.chartPanel.store.getProxy().extraParams.month = tempStr[1];
					this.whereStr += " year = ";
					this.whereStr += tempStr[0];
					this.whereStr += " and month = ";
					this.whereStr += tempStr[1];
					if(SCM.SystemMonthlyYear == tempStr[0] && SCM.SystemMonthlyMonth == tempStr[1]){
						this.exportTableName = 'CurConsignProcessedPriceView';
					} else {
						this.exportTableName = 'HisConsignProcessedPriceView';
					}
				} else {
					showWarning('请选择月份！');
					return;
				}
				if (!Ext.isEmpty(this.searchSupplierId.getValue())) {
					this.listPanel.store.getProxy().extraParams.supplier = this.searchSupplierId.getValue();
					this.whereStr += " and ConsignProcessedPriceV.supplier_id = '";
					this.whereStr += this.searchSupplierId.getValue();
					this.whereStr += "' ";
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
				var header = "加工商,加工件,单位,加工单价,期初数量,收入数量,收入金额,发出数量,发出金额,结存数量";
				var dataIndex = "supplierName,materialName,defaultUnitName,price,beginvolume,inVolume,inSum,outVolume,outSum,volume";

				with (this.listPanel.store) {
					var params = {
						// Store参数
						sort : '[{"property":"supplierId","direction":"ASC"}]',
						filter : Ext.encode(filters.items),

						// 页面参数
						entity : 'CurConsignProcessedPriceView', // 导出实体名称，一般为视图名称。
						title : '加工商对数表', // sheet页名称
						header : header, // 表头
						dataIndex : dataIndex, // 数据引用
						type : 'EXCEL',
						whereStr : this.whereStr
					}
					return params;
				}
			}
		});