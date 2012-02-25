Ext.define('SCM.extend.toolbar.BaseToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.basetoolbar',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							xtype : 'toolbar',
							height : 28,
							defaults : {
								margin : '0 3 0 0',
								xtype : 'button'
							},
							items : [{
										xtype : 'textfield',
										name : 'keyWord',
										emptyText : '请输入查询关键字'
									}, {
										text : '查询',
										iconCls : 'system-search',
										action : 'search'
									}, {
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
										text : '导出',
										iconCls : 'system-export',
										action : 'export'
									}]
						});
				me.callParent();
			}
		})