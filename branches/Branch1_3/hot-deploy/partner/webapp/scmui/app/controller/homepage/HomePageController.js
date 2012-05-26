Ext.define('SCM.controller.homepage.HomePageController', {
			extend : 'Ext.app.Controller',
			views : ['homepage.ListUI'],
			stores : ['homepage.HomePageStatusStore', 'homepage.HomePageVolumeDetailStore', 'homepage.HomePageVolumeChartStore'],
			models : ['homepage.HomePageStatusModel', 'homepage.HomePageVolumeDetailModel', 'homepage.HomePageVolumeChartModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				this.control({
							// 完成日志界面初始化后调用
							'homepage' : {
								afterrender : this.initComponent
							},
							'homepage gridpanel[region=west]' : {
								select : this.refreshChart
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
				this.chartPanel = view.down('panel panel chart');
				this.westPanel = view.down('panel gridpanel[region=west]');
				this.centerPanel = view.down('gridpanel[region=south]');
				this.volumeRefreshButton = view.down('panel button');
				this.searchMaterialId = view.down('panel combogrid[name=searchMaterialId]');
				this.statusRefreshButton = this.centerPanel.tools.refresh;
				this.volumeRefreshButton.addListener('click',this.refreshVolumeList,this);
				this.statusRefreshButton.addListener('click',this.refreshStatusList,this);
			},
			
			/**
			 * 刷新图形
			 * @param {} me
			 * @param {} record
			 * @param {} index
			 * @param {} eOpts
			 */
			refreshChart : function(me, record, index, eOpts) {
				this.chartPanel.store.getProxy().extraParams.materialId = record.get("ID");
				this.chartPanel.store.load({
							scope : this,
							callback : function(records, operation, success) {
								this.chartPanel.redraw();
							}
						});
			},
			
			/**
			 * 刷新物料分布情况
			 * @param {} me
			 */
			refreshVolumeList : function(me){
				if (!Ext.isEmpty(this.searchMaterialId.getValue())) {
					this.westPanel.store.getProxy().extraParams.materialId = this.searchMaterialId.getValue();
				} else {
					this.westPanel.store.getProxy().extraParams.materialId = "";
				}
				this.westPanel.store.load();
			},
			
			/**
			 * 刷新单据完成情况
			 * @param {} me
			 */
			refreshStatusList : function(me){
				this.centerPanel.store.load();
			}
		});