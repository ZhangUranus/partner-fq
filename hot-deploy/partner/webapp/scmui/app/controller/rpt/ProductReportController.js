Ext.define('SCM.controller.rpt.ProductReportController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.pr.ListUI'],
			stores : ['rpt.ProductReportStore', 'rpt.ProductChartStore', 'rpt.MonthStore'],
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
				this.searchMaterialId = view.down('combogrid[name=searchMaterialId]');
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
				this.whereStr = 'TMaterialV.material_type_id = 4 ';
				if (!Ext.isEmpty(this.searchMonth.getValue())) {
					var tempStr = this.searchMonth.getValue().split('-');
					this.listPanel.store.getProxy().extraParams.year = tempStr[0];
					this.listPanel.store.getProxy().extraParams.month = tempStr[1];
					this.whereStr += " and year = ";
					this.whereStr += tempStr[0];
					this.whereStr += " and month = ";
					this.whereStr += tempStr[1];
					if(SCM.SystemMonthlyYear == tempStr[0] && SCM.SystemMonthlyMonth == tempStr[1]){
						this.exportTableName = 'CurMaterialBalanceView';
					} else {
						this.exportTableName = 'HisMaterialBalanceView';
					}
				} else {
					showWarning('请选择月份！');
					return;
				}
				if (!Ext.isEmpty(this.searchWarehouseId.getValue())) {
					this.listPanel.store.getProxy().extraParams.warehouseId = this.searchWarehouseId.getValue();
					this.chartPanel.store.getProxy().extraParams.warehouseId = this.searchWarehouseId.getValue();
					this.whereStr += " and MaterialBalanceV.warehouse_id = '";
					this.whereStr += this.searchWarehouseId.getValue();
					this.whereStr += "' ";
				} else {
					this.listPanel.store.getProxy().extraParams.warehouseId = "";
					this.chartPanel.store.getProxy().extraParams.warehouseId = "";
				}
				if (!Ext.isEmpty(this.searchMaterialId.getValue())) {
					this.listPanel.store.getProxy().extraParams.materialId = this.searchMaterialId.getValue();
					this.chartPanel.store.getProxy().extraParams.materialId = this.searchMaterialId.getValue();
					this.whereStr += " and MaterialBalanceV.material_id = '";
					this.whereStr += this.searchMaterialId.getValue();
					this.whereStr += "' ";
				} else {
					this.listPanel.store.getProxy().extraParams.materialId = "";
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
				var header = "仓库,物料名称,单位,期初数量,期初单价,期初金额,本期收入数量,本期收入单价,本期收入金额,本期发出数量,本期发出单价,本期发出金额,期末数量,期末单价,期末金额";
				var dataIndex = "warehouseName,materialName,unitName,beginvolume,beginPrice,beginsum,volume,price,totalSum,inVolume,inPrice,inSum,outVolume,outPrice,outSum";

				with (this.listPanel.store) {
					var params = {
						// Store参数
						sort : '[{"property":"warehouseName","direction":"ASC"}]',
						filter : Ext.encode(filters.items),

						// 页面参数
						entity : this.exportTableName, // 导出实体名称，一般为视图名称。
						title : '成品报表', // sheet页名称
						header : header, // 表头
						dataIndex : dataIndex, // 数据引用
						type : 'EXCEL',
						whereStr : this.whereStr
					}
					return params;
				}
			}
		});