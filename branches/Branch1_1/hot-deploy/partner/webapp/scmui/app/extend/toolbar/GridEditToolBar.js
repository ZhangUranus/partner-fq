Ext.define('SCM.extend.toolbar.GridEditToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.gridedittoolbar',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							xtype : 'toolbar',
							height : 28,
							defaults : {
								margin : '0 5 0 0',
								xtype : 'button'
							},
							items : [{
										text : '分录新增',
										iconCls : 'bill-addline',
										action : 'addLine'
									}, {
										text : '分录删除',
										iconCls : 'bill-dline',
										action : 'deleteLine'
									}, {
										text : '查看耗料明细',
										iconCls : 'detail',
										hidden : true,
										action : 'viewDetail'
									}, {
										text : '编辑额外耗料',
										iconCls : 'detail-edit',
										hidden : true,
										action : 'editDetail'
									}]
						});
				me.callParent();
			}
		})