/*
 * 定义树形基础资料列表界面 Mark
 */
Ext.define('SCM.view.basedata.department.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.departmentinfomaintaince',
			title : '部门',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'basetoolbar',
										region : 'north'
									}, {
										xtype : 'gridpanel',
										title : '',
										region : 'center',
										store : 'basedata.DepartmentStore',// 列表型store
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'id',
													text : 'id',
													hidden : true
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'parentId',
													text : 'parentId',
													hidden : true
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'parentDeptName',
													text : '上级部门'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'number',
													text : '编号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'name',
													text : '名称'
												}]
									}, {// 树结构
										xtype : 'treepanel',
										width : 200,
										region : 'west',
										border : 0,
										rootVisible : false,
										store : 'basedata.DepartmentTreeStore'// 树形store
									}],
							dockedItems : [{
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'basedata.DepartmentStore',
										displayInfo : true
									}]
						});
				me.callParent();
				me.down('gridpanel').store.loadPage(1);
			}
		});
