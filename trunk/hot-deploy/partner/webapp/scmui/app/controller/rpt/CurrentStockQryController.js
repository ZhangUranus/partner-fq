Ext.define('SCM.controller.rpt.CurrentStockQryController', {
			extend : 'Ext.app.Controller',
			mixins : ['SCM.extend.exporter.Exporter'],
			views : ['rpt.sdr.CurrentStockUI'],
			stores : ['rpt.CurrentStockQryStore'],
			models : ['rpt.CurrentStockQryModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'currentstockreport' : {
								afterrender : this.initComponent
							},
							// 列表界面刷新
							'currentstockreport button[action=search]' : {
								click : this.refreshRecord
							},
							// 数据导出
							'currentstockreport button[action=export]' : {
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
				this.searchStartDate = view.down('datefield[name=searchStartDate]');
				this.searchEndDate = view.down('datefield[name=searchEndDate]');
				this.material = view.down('textfield[name=material]');
				this.warehouse = view.down('textfield[name=warehouse]');
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				if (!Ext.isEmpty(this.material.getValue())) {
					this.listPanel.store.getProxy().extraParams.material = this.material.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.material = "";
				}
				
				if (!Ext.isEmpty(this.warehouse.getValue())) {
					this.listPanel.store.getProxy().extraParams.warehouse = this.warehouse.getValue();
				} else {
					this.listPanel.store.getProxy().extraParams.warehouse = "";
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
				var header = "产品名称,";
				var dataIndex = "MATERIAL_NAME,";
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
					params.report = 'CSQM';
					params.title = '实时库存情况'; // sheet页名称
					params.header = header; // 表头
					params.dataIndex = dataIndex; // 数据引用
					params.pattern = 'SQL';
					params.type = 'EXCEL';
					return params;
				}
			}
		});