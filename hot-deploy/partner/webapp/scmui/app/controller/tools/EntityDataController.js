Ext.define('SCM.controller.tools.EntityDataController', {
			extend : 'Ext.app.Controller',
			views : ['SCM.view.tools.EntityDataUI'],
			init : function() {
				this.control({
							'EntityDataUI' : {
								afterrender : this.initComponent
							}
						})
			},
			/**
			 * 页面初始化方法
			 * 
			 * @param {} grid 事件触发控件
			 */
			initComponent : function(view) {
				this.listContainer = view;
				this.outPath = this.listContainer.down('textfield[name=outPath]');
				this.exportButton = this.listContainer.down('button[action=export]');
				this.exportButton.addListener('click', this.exportData, this); // 监听所有请求回调
				this.settleButton = this.listContainer.down('button[action=settle]');
				this.settleButton.addListener('click', this.checkSettle, this); // 监听所有请求回调
				this.warehouseButton = this.listContainer.down('button[action=warehouse]');
				this.warehouseButton.addListener('click', this.warehouse, this); // 监听所有请求回调
				
				this.warehouseWithoutButton = this.listContainer.down('button[action=warehouseWithout]');
				this.warehouseWithoutButton.addListener('click', this.warehouseWithout, this); // 监听所有请求回调
				
				this.writeButton = this.listContainer.down('button[action=write]');
				this.writeButton.addListener('click', this.writeOutDataToDetail, this); // 监听所有请求回调
				

				this.writeButton = this.listContainer.down('button[action=cancelBill]');
				this.writeButton.addListener('click', this.cancelBill, this); // 监听所有请求回调
			},
			
			/**
			 * 导出系统数据为xml
			 */
			exportData : function() {
				Ext.Ajax.request({
							scope : this,
							url : "../../scm/control/entityExportAll",
							timeout : SCM.limitTimes,
							params : {
								outpath : this.outPath.getValue()
							},
							success : function(response, option) {
								if (response.responseText.length < 1) {
									showError('系统没有返回结果');
								}
								var result = Ext.decode(response.responseText)
								if (result.success) {
									Ext.Msg.alert("提示", "提交成功！");
								} else {
									showError(result.message);
								}
							}
						});
			},
			
			/**
			 * 检查系统结算过程
			 */
			checkSettle : function() {
				Ext.Ajax.request({
							scope : this,
							url : "../../scm/control/monthlySettleCheck",
							timeout : SCM.limitTimes,
							success : function(response, option) {
								if (response.responseText.length < 1) {
									showError('系统没有返回结果');
								}
								var result = Ext.decode(response.responseText)
								if (result.success) {
									Ext.Msg.alert("提示", "结算检查成功！");
								} else {
									showError(result.message);
								}
							}
						});
			},
			
			/**
			 * 手工进仓出仓操作
			 */
			warehouse : function() {
				Ext.Ajax.request({
							scope : this,
							url : "../../scm/control/manualInOutRun",
							timeout : SCM.limitTimes,
							success : function(response, option) {
								if (response.responseText.length < 1) {
									showError('系统没有返回结果');
								}
								var result = Ext.decode(response.responseText)
								if (result.success) {
									Ext.Msg.alert("提示", "手工进仓成功！");
								} else {
									showError(result.message);
								}
							}
						});
			},
			
			/**
			 * 迁移明细数据类
			 */
			writeOutDataToDetail : function() {
				Ext.Ajax.request({
							scope : this,
							url : "../../scm/control/writeInOutDateToDetail",
							timeout : SCM.bigLimitTimes,
							success : function(response, option) {
								if (response.responseText.length < 1) {
									showError('系统没有返回结果');
								}
								var result = Ext.decode(response.responseText)
								if (result.success) {
									Ext.Msg.alert("提示", "返填数据成功！");
								} else {
									showError(result.message);
								}
							}
						});
			},
			
			/**
			 * 批量撤销单据
			 */
			cancelBill : function() {
				Ext.Ajax.request({
							scope : this,
							url : "../../scm/control/cancelBill",
							timeout : SCM.bigLimitTimes,
							success : function(response, option) {
								if (response.responseText.length < 1) {
									showError('系统没有返回结果');
								}
								var result = Ext.decode(response.responseText)
								if (result.success) {
									Ext.Msg.alert("提示", "撤销成功！");
								} else {
									showError(result.message);
								}
							}
						});
			},
			
			/**
			 * 手工进仓出仓操作(不影响库存结算)
			 */
			warehouseWithout : function() {
				Ext.Ajax.request({
							scope : this,
							url : "../../scm/control/manualInOutWithoutStockRun",
							timeout : SCM.limitTimes,
							success : function(response, option) {
								if (response.responseText.length < 1) {
									showError('系统没有返回结果');
								}
								var result = Ext.decode(response.responseText)
								if (result.success) {
									Ext.Msg.alert("提示", "手工进仓成功！");
								} else {
									showError(result.message);
								}
							}
						});
			}

		});