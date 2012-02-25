Ext.define('SCM.extend.toolbar.BillBaseToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.billbasetoolbar',
			initComponent : function() {
				var me = this;
				var today = new Date();
				var tempTool = new Array();
				var startDay = new Date(today.getFullYear(), today.getMonth(), 1);
				
				var tools = [{
							xtype : 'datefield',
							name : 'searchStartDate',
							format : 'Y-m-d',
							width : 135,
							labelWidth : 35,
							fieldLabel : '日期',
							margin : '0 0 0 0',
							value : startDay,
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
							name : 'searchMaterialId',
							width : 145,
							labelWidth : 35,
							fieldLabel : '物料',
							valueField : 'id',
							displayField : 'name',
							store : Ext.create('MaterialStore'),
							matchFieldWidth : false,
							emptyText : '所有物料',
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
						}];

				// 增加供应商/车间/加工商/客户等条件
				if (me.custType) {
					var label = '';
					var labelWidth = 0;
					var custStore;
					if (me.custType == 'supplier') {
						label = '供应商';
						labelWidth = 45;
						custStore = Ext.create('SupplierStore');
					} else if (me.custType == 'workshop') {
						label = '车间';
						labelWidth = 35;
						custStore = Ext.create('WorkshopStore');
					} else if (me.custType == 'processor') {
						label = '加工商';
						labelWidth = 45;
						custStore = Ext.create('SupplierStore');
					} else if (me.custType == 'customer') {
						label = '客户';
						labelWidth = 35;
						custStore = Ext.create('CustomerStore');
					}

					tools = tools.concat([{
								xtype : 'combogrid',
								name : 'searchCustId',
								width : 110 + labelWidth,
								labelWidth : labelWidth,
								fieldLabel : label,
								valueField : 'id',
								displayField : 'name',
								store : custStore,
								matchFieldWidth : false,
								emptyText : '所有'+label,
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
							}]);
				}

				// 增加基础按钮
				tools = tools.concat([{
							text : '查询',
							iconCls : 'system-search',
							action : 'search'
						}, {
							text : '新增',
							iconCls : 'system-add',
							action : 'addNew'
						}, {
							text : '修改',
							iconCls : 'system-edit',
							action : 'modify'
						}, {
							text : '删除',
							iconCls : 'system-delete',
							action : 'delete'
						}]);
				
				// 增加审核按钮
				if (me.audit) {
					tools = tools.concat([{
								text : '审核',
								iconCls : 'system-audit',
								action : 'audit'
							}, {
								text : '反审核',
								iconCls : 'system-unaudit',
								action : 'unaudit'
							}]);
				}
				
				// 增加提交按钮
				if(me.submit){
					tools = tools.concat([{
								text : '提交',
								iconCls : 'system-submit',
								action : 'submit'
							}, {
								text : '撤销',
								iconCls : 'system-rollback',
								action : 'rollback'
							}]);
				}

				// 增加打印按钮
					tools = tools.concat([{
							text : '导出',
							iconCls : 'system-export',
							action : 'export'
						}, {
							text : '打印',
							iconCls : 'system-print',
							action : 'print'
						}]);
				Ext.applyIf(me, {
							height : 28,
							defaults : {
								margin : '0 3 0 0',
								xtype : 'button'
							},
							items : tools
						});
				me.callParent();
			}
		})