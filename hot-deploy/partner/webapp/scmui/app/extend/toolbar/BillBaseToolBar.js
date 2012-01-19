Ext.define('SCM.extend.toolbar.BillBaseToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.billbasetoolbar',
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
										xtype : 'datefield',
										name : 'bizDate',
										format : 'Y-m-d',
										width : 160,
										labelWidth : 35,
										fieldLabel : '日期',
										editable : false
									}, {
										xtype : 'textfield',
										name : 'keyWord',
										emptyText : '请输入查询关键字'
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