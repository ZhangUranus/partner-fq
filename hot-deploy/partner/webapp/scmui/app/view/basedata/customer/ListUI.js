/*
 * 定义列表界面 Mark
 */
Ext.define('SCM.view.basedata.customer.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.custinfomaintaince',
			title : '客户资料',
			store : 'basedata.CustomerStore',
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
										width : 100,
										hidden : true
									}, {
										header : '编码',
										dataIndex : 'number',
										width : 100
									}, {
										header : '名称',
										dataIndex : 'name',
										width : 200
									}, {
										header : '地址',
										dataIndex : 'address',
										width : 200
									}, {
										header : '联系人',
										dataIndex : 'contractor',
										width : 100
									}, {
										header : '电话',
										dataIndex : 'phone',
										width : 100
									}, {
										header : '传真',
										dataIndex : 'fax',
										width : 100
									}, {
										header : '邮箱',
										dataIndex : 'email',
										width : 150
									}],
							dockedItems : [{
										xtype : 'basetoolbar'
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'basedata.CustomerStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
