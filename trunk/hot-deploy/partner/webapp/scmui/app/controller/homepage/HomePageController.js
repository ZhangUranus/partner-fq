Ext.define('SCM.controller.homepage.HomePageController', {
			extend : 'Ext.app.Controller',
			views : ['homepage.ListUI'],
			stores : ['homepage.HomePageStatusStore', 'homepage.HomePageVolumeDetailStore', 'homepage.HomePageVolumeRadarStore'],
			models : ['homepage.HomePageStatusModel', 'homepage.HomePageVolumeDetailModel', 'homepage.HomePageVolumeRadarModel'],

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
			},
			
			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				this.chartPanel.store.load({
							scope : this,
							callback : function(records, operation, success) {
								this.chartPanel.redraw();
							}
						});
			},
			
			refreshChart : function(me, record, index, eOpts) {
				this.chartPanel.store.getProxy().extraParams.materialId = record.get("ID");
				this.refreshRecord();
			}
		});