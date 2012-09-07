/*
 * 定义列表界面 Mark
 */
Ext.define('SCM.view.ProductMap.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.productmaplist',
			title : '产品资料表',
			store : 'ProductMap.ProductMapStore',
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
										header : '宜家产品编码',
										dataIndex : 'ikeaId',
										width : 200
									}, {
										header : '富桥产品名称',
										dataIndex : 'materialName',
										width : 200
									}, {
										header : '板数量',
										dataIndex : 'boardCount',
										width : 200
//									}, {
//										xtype : 'gridcolumn',
//										renderer : SCM.store.basiccode.packageTypeRenderer,
//										dataIndex : 'packageType',
//										width : 100,
//										text : '打板类型'
									}],
							dockedItems : [{
										xtype : 'basetoolbar'
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'ProductMap.ProductMapStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
