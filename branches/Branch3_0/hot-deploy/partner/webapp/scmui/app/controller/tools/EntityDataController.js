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
				this.exportButton = this.listContainer.down('button');
				this.exportButton.addListener('click', this.exportData, this); // 监听所有请求回调
			},

			exportData : function() {
				Ext.Ajax.request({
							scope : this,
							url : "../../scm/control/entityExportAll",
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
			}

		});