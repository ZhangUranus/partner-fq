/*
 * 仓库类型列表界面 Mark
 */
Ext.define('SCM.view.basedata.warehousetype.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.warehousetypelist',
			title : '仓库类型',
			store : 'basedata.WarehouseTypeStore',
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
										store : 'basedata.WarehouseTypeStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
