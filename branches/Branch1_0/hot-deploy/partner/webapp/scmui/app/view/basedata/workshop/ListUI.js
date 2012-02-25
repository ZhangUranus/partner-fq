/*
 * 仓库类型列表界面 Mark
 */
Ext.define('SCM.view.basedata.workshop.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.workshoplist',
			title : '车间',
			store : 'basedata.WorkshopStore',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							columns : [{
										header : '序号',
										xtype : 'rownumberer',
										width : 40
									}, {
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
									}, {
										header : '描述',
										dataIndex : 'description',
										width : 300
									}],
							dockedItems : [{
										xtype : 'basetoolbar'
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'basedata.WorkshopStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
