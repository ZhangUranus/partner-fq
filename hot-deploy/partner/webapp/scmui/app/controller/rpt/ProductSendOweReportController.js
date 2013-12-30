Ext.define('SCM.controller.rpt.ProductSendOweReportController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.pso.ListUI'],
			stores : ['rpt.ProductSendOweReportStore', 'rpt.ProductSendOweDetailReportStore'],
			models : ['rpt.ProductSendOweReportModel', 'rpt.ProductSendOweDetailReportModel', 'rpt.MonthModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'productsendowereport' : {
								afterrender : this.initComponent
							},
							'productsendowereport gridpanel[region=center]' : {
								select : this.showDetail
							},
							
							// 列表界面刷新
							'productsendowereport button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'productsendowereport button[action=export]' : {
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
				this.detailPanel = view.down('gridpanel[region=south]');
				this.searchWeek = view.down('textfield[name=week]');
//				this.searchMaterialId = view.down('combogrid[name=searchMaterialId]');
//				this.searchBlurMaterialName = view.down('textfield[name=blurMaterialName]');
				this.searchKeyWord = view.down('textfield[name=searchKeyWord]');
				
				this.listPanel.store.removeAll(true);
				this.detailPanel.store.removeAll(true);
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				if (!Ext.isEmpty(this.searchWeek.getValue())) {
					this.listPanel.store.getProxy().extraParams.week = this.searchWeek.getValue();
				} else {
					showWarning('请输入周！');
					return;
				}
//				if (!Ext.isEmpty(this.searchMaterialId.getValue())) {
//					this.listPanel.store.getProxy().extraParams.searchMaterialId = this.searchMaterialId.getValue();
//				} else {
//					this.listPanel.store.getProxy().extraParams.searchMaterialId = "";
//				}
				if (!Ext.isEmpty(this.searchKeyWord.getValue())) {
					this.listPanel.store.getProxy().extraParams.keyWord = this.searchKeyWord.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.keyWord = "";
				}
				this.listPanel.store.load();
			},
			/**
			 * 显示分录明细
			 */
			showDetail : function(me,record, index,eOpts){
				if(record.get('MATERIAL_ID')){
					this.detailPanel.store.getProxy().extraParams.week =record.get('WEEK'); 
					this.detailPanel.store.getProxy().extraParams.materialId =record.get('MATERIAL_ID');
					this.detailPanel.store.getProxy().extraParams.materialName =record.get('MATERIAL_NAME');
					this.detailPanel.store.getProxy().extraParams.preWeekBal =record.get('LAST_WEEK_BAL_QTY');
					this.detailPanel.store.getProxy().extraParams.preWeekOwe =record.get('LAST_WEEK_OWE_QTY');
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
					params.report = 'PSOR';
					params.title = '综合欠数表'; // sheet页名称
					params.header = header; // 表头
					params.dataIndex = dataIndex; // 数据引用
					params.pattern = 'SQL';
					params.type = 'EXCEL';
					return params;
				}
			}
		});