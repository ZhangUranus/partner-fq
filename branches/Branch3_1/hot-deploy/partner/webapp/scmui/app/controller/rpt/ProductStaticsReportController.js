Ext.define('SCM.controller.rpt.ProductStaticsReportController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.psr.ListUI'],
			stores : ['rpt.ProductStaticsReportStore'],
			models : ['rpt.ProductStaticsReportModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'productstaticsreport' : {
								afterrender : this.initComponent
							},
							// 列表界面刷新
							'productstaticsreport button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'productstaticsreport button[action=export]' : {
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
				this.searchDate = view.down('datefield[name=searchStartDate]');
				this.searchKeyWord = view.down('textfield[name=searchKeyWord]');
				this.refreshRecord();
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				if (!Ext.isEmpty(this.searchDate.getValue())) {
					this.listPanel.store.getProxy().extraParams.searchDate = this.searchDate.getRawValue();
				} else {
					showWarning('请选择日期！');
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
					params.report = 'PSR';
					params.title = '综合成品帐'; // sheet页名称
					params.header = header; // 表头
					params.dataIndex = dataIndex; // 数据引用
					params.pattern = 'SQL';
					params.type = 'EXCEL';
					return params;
				}
			}
		});