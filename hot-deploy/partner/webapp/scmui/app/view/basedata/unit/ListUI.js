/*
 * 定义列表界面 Mark
 */
Ext.define('SCM.view.basedata.unit.ListUI', {
			extend : 'Ext.grid.Panel',
			alias : 'widget.unitlist',
			title : '计量单位',
			store : 'basedata.UnitStore',
			initComponent : function() {
				this.initColumns();
				this.initToolBar();
				this.callParent(arguments);
				this.store.loadPage(1);
			},

			// 初始化列
			initColumns : function() {
				this.columns = [{
							header : 'id',
							dataIndex : 'id',
							width : 200,
							hidden : true
						}, {
							header : '编码',
							dataIndex : 'number',
							width : 200
						}, {
							header : '名称',
							dataIndex : 'name',
							width : 200
						}];
			},
			// 初始化工具栏
			initToolBar : function() {
				this.dockedItems = [{
							xtype : 'toolbar',
							height: 28,
							items : [{
										xtype : 'textfield',
										name : 'keyWord',
										emptyText : '请输入单位名称',
										id : 'keyWord'
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
						}, {
							dock : 'bottom',
							xtype : 'pagingtoolbar',
							store : 'basedata.UnitStore',
							displayInfo : true,
							displayMsg : '显示 {0} - {1} 条，共计 {2} 条',
							emptyMsg : '没有数据'
						}];
			}
		});
