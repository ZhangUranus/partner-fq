/*
 * 定义列表界面 Jeff
 */
Ext.define('SCM.view.ProductOutNotificationModify.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.ProductOutNotificationModify',
			title : '出货通知单变更',
			store : 'ProductOutNotificationModify.ProductOutNotificationModifyStore',
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
										width : 160
									}, {
										header : '单号',
										dataIndex : 'deliverNumber',
										width : 160
									}, {
										xtype : 'gridcolumn',
										renderer : SCM.store.basiccode.operateTypeRenderer,
										dataIndex : 'operateType',
										text : '操作类型',
										width : 60
									}, {
										header : '货号',
										dataIndex : 'goodNumber',
										width : 160
									}, {
										header : '产品名称（新增）',
										dataIndex : 'materialName',
										width : 160
									}, {
										header : '通知单产品名称（修改）',
										dataIndex : 'notificationMaterialName',
										width : 160
									}, {
										header : '通知单订单数量',
										dataIndex : 'volume',
										width : 160
									}, {
										header : '对数表打板产品名称（修改）',
										dataIndex : 'verifyEntryMaterialName',
										width : 160
									}, {
										header : '计划打板数量',
										dataIndex : 'verifyEntryVolume',
										width : 160
									}, {
										xtype : 'gridcolumn',
										renderer : SCM.store.basiccode.billStatusRenderer,
										dataIndex : 'status',
										width : 80,
										groupable : false,
										text : '单据状态'
									}, {
										header : '提交人',
										dataIndex : 'submitterSystemUserName',
										width : 160
									}],
							dockedItems : [{
										xtype : 'basetoolbar',
										submit : true
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'ProductOutNotificationModify.ProductOutNotificationModifyStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
