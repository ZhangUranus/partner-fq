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