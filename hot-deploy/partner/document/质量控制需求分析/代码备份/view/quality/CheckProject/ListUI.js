/*
 * 定义列表界面 Mark
 */
Ext.define('SCM.view.quality.CheckProject.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.checkprojectinfomaintaince',
			title : '检验项目维护',
			store : 'quality.CheckProject.CheckProjectStore',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							columns : [{
										header : '序号',
										xtype : 'rownumberer',
										width : 40
									}, {
										header : '编码',
										dataIndex : 'number',
										width : 80
									}, {
										header : '名称',
										dataIndex : 'name',
										width : 150
									}, {
										header : '创建者',
										dataIndex : 'creatorName',
										width : 80
									}, {
										header : '最后修改人',
										dataIndex : 'lastUpdaterName',
										width : 80
									}, {
										header : '检验要求',
										dataIndex : 'checkRequire',
										width : 200
									}, {
										header : '检验方法',
										dataIndex : 'checkMethod',
										width : 150
									}, {
										header : '参考文件',
										dataIndex : 'reference',
										width : 100
									}, {
										xtype : 'datecolumn',
										dataIndex : 'createdStamp',
										width : 150,
										format : 'Y-m-d H:i:s',
										groupable : false,
										text : '创建时间'
									}, {
										xtype : 'datecolumn',
										dataIndex : 'lastUpdatedStamp',
										width : 150,
										format : 'Y-m-d H:i:s',
										groupable : false,
										text : '最后修改时间'
									}],
							dockedItems : [{
										xtype : 'basetoolbar'
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'quality.CheckProject.CheckProjectStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
