/*
 * 仓库列表界面 Mark
 */
Ext.define('SCM.view.basedata.warehouse.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.warehouseinfomaintaince',// 对应菜单link
			title : '仓库',
			store : 'basedata.WarehouseStore',
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
										header : '仓库类型id',
										dataIndex : 'wsTypeId',
										width : 200,
										hidden : true
									}, {
										header : '仓库类型',
										dataIndex : 'warehouseTypeName',
										width : 200
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
										store : 'basedata.WarehouseStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
