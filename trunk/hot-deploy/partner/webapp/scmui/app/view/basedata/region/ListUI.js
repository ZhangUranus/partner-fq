/*
 * 定义列表界面 Mark
 */
Ext.define('SCM.view.basedata.region.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.regionlist',
			title : '地区',
			store : 'basedata.RegionStore',
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
										width : 200
									}, {
										header : '名称',
										dataIndex : 'name',
										width : 200
									}, {
										header : '描述',
										dataIndex : 'description',
										width : 400
									}],
							dockedItems : [{
										xtype : 'basetoolbar'
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'basedata.RegionStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
