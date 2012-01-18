Ext.define('SCM.extend.toolbar.BillBaseToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.billbasetoolbar',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							xtype : 'toolbar',
							height : 28,
							defaults : {
								xtype : 'button'
							},
							items : [{
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
									}, {
										text : '刷新',
										iconCls : 'system-refresh',
										action : 'refresh'
									}, {
										text : '审核',
										iconCls : 'system-audit',
										action : 'audit'
									}, {
										text : '反审核',
										iconCls : 'system-unaudit',
										action : 'unaudit'
									}, {
										text : '打印',
										iconCls : 'system-print',
										action : 'print'
									}]
						});
				me.callParent();
			}
		})