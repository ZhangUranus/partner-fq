/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.Supplier.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.Supplierlist',
			title : '供应商查询',
			store : 'Supplier.SupplierEditStore',
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
										width : 150
									}, {
										header : '名称',
										dataIndex : 'name',
										width : 150
									}, {
										header : '供应商电话',
										dataIndex : 'phoneNum',
										width : 150,
										groupable : false
									}, {
										header : '供应商地址',
										dataIndex : 'address',
										width : 150,
										groupable : false
									}],
							dockedItems : [{
										xtype : 'basetoolbar'
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'Supplier.SupplierEditStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
