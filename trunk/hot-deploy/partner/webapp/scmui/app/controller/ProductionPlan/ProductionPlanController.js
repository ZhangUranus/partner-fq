Ext.define('SCM.controller.ProductionPlan.ProductionPlanController', {
			extend : 'Ext.app.Controller',
			views : ['ProductionPlan.ListUI'],
			stores : ['ProductionPlan.ProductionPlanStore'],
			models : ['ProductionPlan.ProductionPlanModel'],

			/**
			 * 初始化controller 增加事件监控
			 */
			init : function() {
				debugger;
				this.control({
							// 完成日志界面初始化后调用
							'productionplan' : {
								afterrender : this.initComponent
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
				debugger;
				this.listPanel = view.down('form gridpanel');
				this.materialIdField = view.down('form combogrid[name=processedMaterialId]');
				this.materialVolumeField = view.down('form numberfield[name=materialVolume]');
				this.materialIdField.addListener('change', this.refreshRecord, this);
				this.materialVolumeField.addListener('change', this.refreshRecord, this);
			},

			/**
			 * 重写刷新方法
			 * 
			 */
			refreshRecord : function() {
				if (!Ext.isEmpty(this.materialIdField.getValue())) {
					this.listPanel.store.getProxy().extraParams.materialId = this.materialIdField.getValue();
				} else {
					showWarning('请选择加工件！');
				}
				if (!Ext.isEmpty(this.materialVolumeField.getValue())) {
					this.listPanel.store.getProxy().extraParams.materialVolume = this.materialVolumeField.getValue();
				}
				this.listPanel.store.load();
			}
		});