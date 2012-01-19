Ext.define('SCM.extend.toolbar.SaveToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.savetoolbar',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							xtype : 'toolbar',
							height : 28,
							defaults : {
								margin : '0 5 0 0',
								xtype : 'button'
							},
							items : ['->', {
										text : '保存',
										iconCls : 'system-save',
										action : 'save'
									}, {
										text : '重填',
										iconCls : 'system-clear',
										action : 'clear'
									}, {
										xtye : 'button',
										text : '打印',
										iconCls : 'system-print',
										action : 'print'
									}, {
										text : '取消',
										iconCls : 'system-delete',
										action : 'cancel'
									}]
						});
				me.callParent();
			}
		})