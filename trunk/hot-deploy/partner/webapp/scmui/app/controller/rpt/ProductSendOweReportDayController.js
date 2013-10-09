Ext.define('SCM.controller.rpt.ProductSendOweReportDayController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.psod.ListUI','rpt.psod.DetailListUI'],
			stores : ['rpt.ProductSendOweReportDayStore','rpt.ProductSendOweDetailReportDayStore','rpt.ProductSendOweEntryReportDayStore'],
			models : ['rpt.ProductSendOweReportDayModel','rpt.ProductSendOweDetailReportDayModel','rpt.ProductSendOweEntryReportDayModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'productsendowereportday' : {
								afterrender : this.initComponent
							},
							'productsendowereportday gridpanel[region=center]' : {
								select : this.selectRecord,
								itemdblclick : this.queryDetail // 双击列表，弹出查看明细情况页面
							},
							// 列表界面刷新
							'productsendowereportday button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'productsendowereportday button[action=export]' : {
								click : this.exportExcel
							},
							// 查看明细情况页面
							'productsendowereportday button[action=querydetail]' : {
								click : this.queryDetailAction
							},
							// 查看明细情况页面
							'productSendOweReportDayDetailList button[action=search]' : {
								click : this.refreshDetailRecord
							},
							'productSendOweReportDayDetailList gridpanel[region=center]' : {
								select : this.showDetail
							},
						});
			},

			/**
			 * 页面初始化方法
			 * 
			 * @param {}
			 *            grid 事件触发控件
			 */
			initComponent : function(view) {
				debugger;
				this.listPanel = view.down('gridpanel[region=center]');
				this.searchStartDate = view.down('datefield[name=searchStartDate]');
				this.searchKeyWord = view.down('textfield[name=searchKeyWord]');
				this.listPanel.store.removeAll(true);
				
				//初始化明细页面
				this.winDetailList = Ext.widget('productSendOweReportDayDetailList');
				this.detailListPanel = this.winDetailList.down('gridpanel[region=center]');
				this.entryListPanel = this.winDetailList.down('gridpanel[region=south]');
				this.searchStartDateField = this.winDetailList.down('datefield[name=searchStartDate]');
				this.searchMaterialIdField = this.winDetailList.down('combogrid[name=searchMaterialId]');
				
				this.refreshRecord();
			},
			
			
			/**
			 * 选中数据
			 * 
			 * @return {}
			 */
			selectRecord : function(me,record) {
				this.currentRecord = record;
			},
			
			/**
			 * 获取当前操作的Record
			 * 
			 * @return {}
			 */
			getSelectRecord : function() {
				var sm = this.listPanel.getSelectionModel();
				if (sm.hasSelection()) {// 判断是否选择行记录
					return sm.getLastSelected();
				} else {
					return this.currentRecord;
				}
			},
			
			/**
			 * 显示分录
			 * 
			 * @return {}
			 */
			showDetail : function(me,record) {
				this.entryListPanel.store.getProxy().extraParams.startDate =Ext.Date.format(record.data.BIZDATE,'Y-m-d');
				this.entryListPanel.store.getProxy().extraParams.number =record.data.NUMBER;
				this.entryListPanel.store.load();
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				if (!Ext.isEmpty(this.searchStartDate.getRawValue())) {
					this.listPanel.store.getProxy().extraParams.startDate = this.searchStartDate.getRawValue() ;
				} else {
					showWarning('请选择开始日期！');
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
			 * 显示明细情况
			 */
			queryDetail : function(grid,record){
				this.searchStartDateField.setValue(new Date(record.data.BIZDATE));
				this.searchMaterialIdField.setValue(record.data.MATERIAL_ID);
				this.winDetailList.show();
				this.refreshDetailRecord();
			},
			
			/**
			 * 显示明细情况
			 */
			queryDetailAction : function(button){
				record = this.getSelectRecord();
				// 如果单据状态是已提交、已审核或者已经结算则不能修改
				this.queryDetail(this.listPanel, record);
			},
			
			/**
			 * 明细刷新
			 * 
			 */
			refreshDetailRecord : function() {
				if (!Ext.isEmpty(this.searchStartDateField.getRawValue())) {
					this.detailListPanel.store.getProxy().extraParams.startDate = this.searchStartDateField.getRawValue() ;
				} else {
					showWarning('请选择开始日期！');
					return;
				}
				if (!Ext.isEmpty(this.searchMaterialIdField.getValue())) {
					this.detailListPanel.store.getProxy().extraParams.materialId = this.searchMaterialIdField.getValue();
				} else {
					this.detailListPanel.store.getProxy().extraParams.materialId = "";
				}

				this.entryListPanel.store.removeAll();
				this.detailListPanel.store.load();
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
					params.report = 'PSORD';
					params.title = '综合欠数表(日)'; // sheet页名称
					params.header = header; // 表头
					params.dataIndex = dataIndex; // 数据引用
					params.pattern = 'SQL';
					params.type = 'EXCEL';
					return params;
				}
			}
		});