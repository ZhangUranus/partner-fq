/*
 * 定义列表界面 Mark
 */
Ext.define('SCM.view.basedata.unit.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.unitlist',
			title : '计量单位',
			store : 'basedata.UnitStore',
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
									}],
							dockedItems : [{
										xtype : 'basetoolbar'
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'basedata.UnitStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
