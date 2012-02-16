Ext.define('SCM.controller.rpt.PackingMaterialReportController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.pkm.ListUI'],
			stores : ['rpt.PackingMaterialReportStore', 'rpt.PackingMaterialDetailStore', 'rpt.MonthStore'],
			models : ['rpt.PackingMaterialReportModel', 'rpt.PackingMaterialDetailModel', 'rpt.MonthModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'packingmaterialreport' : {
								afterrender : this.initComponent
							},
							// 列表事件
							'packingmaterialreport gridpanel[region=center]' : {
								select : this.showDetail
							},
							// 列表界面刷新
							'packingmaterialreport button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'packingmaterialreport button[action=export]' : {
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
				this.refreshRecord();
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				this.whereStr = "TMaterialV.MATERIAL_TYPE_ID = 5 ";
				if (!Ext.isEmpty(this.searchStartDate.getRawValue())) {
					this.listPanel.store.getProxy().extraParams.startDate = this.searchStartDate.getRawValue() + ' 00:00:00';
					this.whereStr += " AND WorkshopWarehousingV.biz_Date >= '" + this.searchStartDate.getRawValue() + " 00:00:00'";
				} else {
					showWarning('请选择开始日期！');
					return;
				}
				if (!Ext.isEmpty(this.searchEndDate.getRawValue())) {
					this.listPanel.store.getProxy().extraParams.endDate = this.searchEndDate.getRawValue() + ' 23:59:59';
					this.whereStr += " AND WorkshopWarehousingV.biz_Date <= '" + this.searchEndDate.getRawValue() + " 23:59:59'";
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
					this.whereStr += " and WorkshopWarehousingEntryV.warehouse_warehouse_id = '";
					this.whereStr += this.searchWarehouseId.getValue();
					this.whereStr += "' ";
				} else {
					this.listPanel.store.getProxy().extraParams.warehouseId = "";
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
				var header = "业务日期,单据编码,单据状态,仓库,包装名称,规格型号,单位,数量,单价,总金额";
				var dataIndex = "bizDate,number,status,warehouseName,materialName,materialModel,unitName,volume,price,entrysum";

				with (this.listPanel.store) {
					var params = {
						// Store参数
						sort : '[{"property":"bizDate","direction":"ASC"}]',
						filter : Ext.encode(filters.items),

						// 页面参数
						entity : 'WorkshopWarehousingPackingView', // 导出实体名称，一般为视图名称。
						title : '安装包装材料表', // sheet页名称
						header : header, // 表头
						dataIndex : dataIndex, // 数据引用
						type : 'EXCEL',
						whereStr : this.whereStr
					}
					return params;
				}
			}
		});