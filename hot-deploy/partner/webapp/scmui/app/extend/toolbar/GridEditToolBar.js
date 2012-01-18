Ext.define('SCM.extend.toolbar.GridEditToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.gridedittoolbar',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							xtype : 'toolbar',
							height : 28,
							minWidth : 50,
							items : [{
										text : '分录新增',
										iconCls : 'bill-addline',
										action : 'addLine'
									}, {
										text : '分录删除',
										iconCls : 'bill-dline',
										action : 'deleteLine'
									}]
						});
				me.callParent();
			}
		})