/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.system.log.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.logmanagement',
			title : '日志查询',
			initComponent : function() {
				var me = this;
				var today = new Date();
				Ext.applyIf(me, {
							title : '',
							region : 'center',
							store : 'system.LogStore',
							columns : [{
										header : '序号',
										xtype : 'rownumberer',
										width : 40
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'id',
										text : 'id',
										hidden : true
									}, {
										xtype : 'datecolumn',
										dataIndex : 'hitTime',
										width : 180,
										format : 'Y-m-d H:i:s',
										groupable : false,
										text : '访问时间'
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'name',
										width : 180,
										text : '页面名称'
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'operateType',
										width : 120,
										text : '访问类型'
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'runningTime',
										width : 120,
										text : '耗时（毫秒）'
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'userId',
										width : 120,
										text : '用户'
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'ipAddress',
										width : 120,
										text : '访问IP'
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'hostName',
										width : 120,
										text : '访问机器名称'
									}],
							dockedItems : [{
										xtype : 'toolbar',
										height : 28,
										defaults : {
											margin : '0 3 0 0',
											xtype : 'button'
										},
										items : [{
													xtype : 'datefield',
													name : 'searchStartDate',
													format : 'Y-m-d',
													width : 135,
													labelWidth : 35,
													fieldLabel : '日期',
													margin : '0 0 0 0',
													value : today,
													editable : false
												}, {
													xtype : 'datefield',
													name : 'searchEndDate',
													format : 'Y-m-d',
													width : 115,
													labelWidth : 15,
													fieldLabel : '至',
													labelSeparator : '',
													value : today,
													editable : false
												}, {
													xtype : 'combogrid',
													name : 'searchUserId',
													width : 145,
													labelWidth : 35,
													fieldLabel : '用户',
													valueField : 'id',
													displayField : 'name',
													store : Ext.create('SystemUserStore'),
													matchFieldWidth : false,
													listConfig : {
														width : SCM.MaxSize.COMBOGRID_WIDTH,
														height : SCM.MaxSize.COMBOGRID_HEIGHT,
														columns : [{
																	header : '编码',
																	dataIndex : 'number',
																	width : 100,
																	hideable : false
																}, {
																	header : '名称',
																	dataIndex : 'name',
																	width : 80,
																	hideable : false
																}]
													}
												}, {
													text : '查询',
													iconCls : 'system-search',
													action : 'search'
												}, {
													text : '导出',
													iconCls : 'system-export',
													action : 'export'
												}]
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'system.LogStore',
										displayInfo : true
									}]
						});
				me.callParent(arguments);
			}
		});
