Ext.define('SCM.extend.toolbar.BaseToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.basetoolbar',
			initComponent : function() {
				var me = this;
				var tools = [{
							xtype : 'textfield',
							name : 'keyWord',
							minWidth : 120,
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
						}];
				if (me.bomBill) {
					tools = tools.concat([{
								text : '复制',
								iconCls : 'system-copy',
								action : 'copy'
							}, {
								text : '核准',
								iconCls : 'system-audit',
								action : 'audit'
							}, {
								text : '导出明细',
								iconCls : 'system-exportDetail',
								action : 'exportDetail'
							}]);
				}
				tools = tools.concat([{
							text : '导出',
							iconCls : 'system-export',
							action : 'export'
						}]);
				
				// 增加导入按钮
				if (me.isImport) {
					tools = tools.concat([{
								text : '导入',
								iconCls : 'system-import',
								action : 'import'
							}]);
				}
				Ext.applyIf(me, {
							xtype : 'toolbar',
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