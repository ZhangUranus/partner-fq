Ext.define('SCM.controller.rpt.SemiProductCostReportController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.spc.ListUI'],
			stores : ['rpt.SemiProductCostReportStore', 'rpt.SemiProductCostDetailStore', 'rpt.MonthStore', 'basedata.SemiMaterialStore'],
			models : ['rpt.SemiProductCostReportModel', 'rpt.SemiProductCostDetailModel', 'rpt.MonthModel', 'basedata.SemiMaterialModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'semiproductcostreport' : {
								afterrender : this.initComponent
							},
							// 列表事件
							'semiproductcostreport gridpanel[region=center]' : {
								select : this.showDetail
							},
							// 列表界面刷新
							'semiproductcostreport button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'semiproductcostreport button[action=export]' : {
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
				this.detailPanel = view.down('gridpanel[region=south]');// 明细列表
				this.searchStartDate = view.down('datefield[name=searchStartDate]');
				this.searchEndDate = view.down('datefield[name=searchEndDate]');
				this.searchWarehouseId = view.down('combogrid[name=searchWarehouseId]');
				this.searchMaterialId = view.down('combogrid[name=searchMaterialId]');
				this.refreshRecord();
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
				
				if (!Ext.isEmpty(this.searchWarehouseId.getValue())) {
					this.listPanel.store.getProxy().extraParams.warehouseId = this.searchWarehouseId.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.warehouseId = "";
				}
				if (!Ext.isEmpty(this.searchMaterialId.getValue())) {
					this.listPanel.store.getProxy().extraParams.materialId = this.searchMaterialId.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.materialId = "";
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
				if (record != null && record.get("NUMBER") != null) {
					this.detailPanel.store.getProxy().extraParams.number = record.get("NUMBER");
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
					params.report = 'SPC';
					params.title = '黑坯材料耗用表'; // sheet页名称
					params.header = header; // 表头
					params.dataIndex = dataIndex; // 数据引用
					params.pattern = 'SQL';
					params.type = 'EXCEL';
					return params;
				}
			}
		});