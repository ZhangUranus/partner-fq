/*
 * 定义列表界面 Mark
 */
Ext.define('SCM.view.quality.Process.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.processinfomaintaince',
			title : '工序表管理',
			store : 'quality.Process.ProcessStore',
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
										width : 100
									}, {
										header : '名称',
										dataIndex : 'name',
										width : 200
									}, {
										header : '创建者',
										dataIndex : 'creatorName',
										width : 100
									}, {
										header : '最后修改人',
										dataIndex : 'lastUpdaterName',
										width : 100
									}, {
										header : '描述',
										dataIndex : 'description',
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
										store : 'quality.Process.ProcessStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
