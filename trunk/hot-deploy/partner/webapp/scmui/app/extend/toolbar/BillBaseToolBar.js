Ext.define('SCM.extend.toolbar.BillBaseToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.billbasetoolbar',
			initComponent : function() {
				var me = this;
				
				// 增加基础按钮
				var tools = [{
							text : '新增',
							iconCls : 'system-add',
							action : 'addNew'
						}, {
							text : '修改',
							iconCls : 'system-edit',
							action : 'modify'
						}, {
							text : '删除',
							iconCls : 'system-delete',
							action : 'delete'
						}];

				// 增加审核按钮
				if (me.audit) {
					tools = tools.concat([{
								text : '审核',
								iconCls : 'system-audit',
								action : 'audit'
							}, {
								text : '反审核',
								iconCls : 'system-unaudit',
								action : 'unaudit'
							}]);
				}

				// 增加提交按钮
				if (me.submit) {
					tools = tools.concat([{
								text : '提交',
								iconCls : 'system-submit',
								action : 'submit'
							}, {
								text : '撤销',
								iconCls : 'system-rollback',
								action : 'rollback'
							}]);
				}
				// 增加提交按钮
				if (me.checkSubmit) {
					tools = tools.concat([{
								text : '提交检查',
								iconCls : 'system-submit',
								action : 'checkSubmit'
							}]);
				}

				// 增加打印按钮
				tools = tools.concat([{
							text : '导出',
							iconCls : 'system-export',
							action : 'export'
						}, {
							text : '打印',
							iconCls : 'system-print',
							action : 'print'
						}]);
				
				// 增加打印按钮按钮
				if (me.extraPrint) {
					tools = tools.concat([{
							text : '其它打印',
							iconCls : 'system-print',
							action : 'extraPrint'
						}]);
				}
				
				// 增加扫描按钮
				if (me.scan) {
					tools = tools.concat([{
								text : '条码扫描',
								iconCls : 'system-scan',
								action : 'scan'
							}, {
								text : '撤销扫描',
								iconCls : 'system-unscan',
								action : 'unscan'
							}]);
				}
				
				// 增加导入按钮
				if (me.isImport) {
					tools = tools.concat([{
								text : '导入',
								iconCls : 'system-import',
								action : 'import'
							}]);
				}
				
				// 增加提交按钮
				if (me.isSubmitReport) {
					tools = tools.concat([{
								text : '提交欠数表',
								iconCls : 'system-submit',
								action : 'submitreport'
							}]);
				}
				
				Ext.applyIf(me, {
							height : 28,
							defaults : {
								margin : '0 3 0 0',
								xtype : 'button'
							},
							items : tools
						});
				me.callParent();
			}
		})