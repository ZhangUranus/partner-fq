Ext.define('SCM.extend.toolbar.SaveToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.savetoolbar',
			initComponent : function() {
				var me = this;
				var tools = [];
				tools.push(['->']);
				if (me.type == 'bill') {
					tools.push([{
								text : '验收',
								iconCls : 'system-submit',
								hidden : true,
								action : 'check'
							}, {
								text : '直接提交',
								iconCls : 'system-submit',
								action : 'submit'
							}]);
				}
				tools.push([{
							text : '保存',
							iconCls : 'system-save',
							action : 'save'
						}]);
				if (me.type != 'simple') {
					tools.push([{
								text : '重填',
								iconCls : 'system-clear',
								action : 'clear'
							}, {
								xtye : 'button',
								text : '打印',
								iconCls : 'system-print',
								action : 'print'
							}]);
				}
				tools.push([{
							text : '取消',
							iconCls : 'system-delete',
							action : 'cancel'
						}]);
				Ext.applyIf(me, {
							xtype : 'toolbar',
							height : 28,
							defaults : {
								margin : '0 5 0 0',
								xtype : 'button'
							},
							items : tools
						});
				me.callParent();
			}
		})