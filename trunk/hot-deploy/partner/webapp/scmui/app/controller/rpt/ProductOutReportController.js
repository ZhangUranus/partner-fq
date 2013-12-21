Ext.define('SCM.controller.rpt.ProductOutReportController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.pr.ListOutStatUI'],
			stores : ['rpt.ProductOutReportStore','rpt.ProductOutReportDetailStore'],
			models : ['rpt.ProductOutReportModel', 'rpt.ProductOutReportDetailModel', 'rpt.MonthModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'productoutreport' : {
								afterrender : this.initComponent
							},
							// 列表事件
							'productoutreport gridpanel[region=center]' : {
								select : this.showDetail
							},
							// 列表界面刷新
							'productoutreport button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'productoutreport button[action=export]' : {
								click : this.exportExcel
							},
							// 数据导出
							'productoutreport button[action=exportDetail]' : {
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
				this.detailPanel = view.down('gridpanel[region=south]');// 明细列表
				this.searchMonth = view.down('combobox[name=searchMonth]');
				this.searchKeyWord = view.down('textfield[name=searchKeyWord]');
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
				if (!Ext.isEmpty(this.searchKeyWord.getValue())) {
					this.listPanel.store.getProxy().extraParams.keyWord = this.searchKeyWord.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.keyWord = "";
				}
				this.listPanel.store.load();
			},
			
			/**
			 * 显示分录信息
			 * @param {} me
			 * @param {} record
			 * @param {} index
			 * @param {} eOpts
			 */
			showDetail : function(me, record, index, eOpts) {
				if (record != null && record.get("MATERIAL_ID") != null ) {
					this.detailPanel.store.getProxy().extraParams.material_id = record.get("MATERIAL_ID");
					var tempStr = this.searchMonth.getValue().split('-');
					this.detailPanel.store.getProxy().extraParams.year = tempStr[0];
					this.detailPanel.store.getProxy().extraParams.month = tempStr[1];
					this.detailPanel.store.load();
				}
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
					params.report = 'POR';
					params.title = '成品出货情况'; // sheet页名称
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
				var header = "产品名称,出货日期,货号,数量";
				var dataIndex = "MATERIAL_NAME,BIZ_DATE,GOOD_NUMBER,VOLUME";
				
				with (this.detailPanel.store) {
					var params = getProxy().extraParams;

					// 页面参数
					params.report = 'PORD';
					params.title = '成品出货情况明细'; // sheet页名称
					params.header = header; // 表头
					params.dataIndex = dataIndex; // 数据引用
					params.pattern = 'SQL';
					params.type = 'EXCEL';
					return params;
				}
			}
		});