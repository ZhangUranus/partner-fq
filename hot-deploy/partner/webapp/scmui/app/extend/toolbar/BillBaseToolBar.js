Ext.define('SCM.extend.toolbar.BillBaseToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.billbasetoolbar',
			initComponent : function() {
				var me = this;
				var tools = [];

				// 增加日期条件
				tools.push([{
							xtype : 'datefield',
							name : 'searchStartDate',
							format : 'Y-m-d',
							width : 135,
							labelWidth : 35,
							fieldLabel : '日期',
							margin : '0 0 0 0',
							editable : false
						}, {
							xtype : 'datefield',
							name : 'searchEndDate',
							format : 'Y-m-d',
							width : 115,
							labelWidth : 15,
							fieldLabel : '至',
							labelSeparator : '',
							editable : false
						}, {
							xtype : 'combobox',
							name : 'searchMaterialId',
							width : 145,
							labelWidth : 35,
							fieldLabel : '物料',
							store : Ext.create('MaterialStore'),
							valueField : 'id',
							displayField : 'name'
						}]);

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
					} else if (me.custType == 'processor') {
						label = '加工商';
						labelWidth = 45;
						custStore = Ext.create('CustomerStore');
					} else if (me.custType == 'customer') {
						label = '客户';
						labelWidth = 35;
						custStore = Ext.create('CustomerStore');
					}

					tools.push([{
								xtype : 'combobox',
								name : 'searchCustId',
								width : 110 + labelWidth,
								labelWidth : labelWidth,
								fieldLabel : label,
								store : custStore,
								valueField : 'id',
								displayField : 'name'
							}]);
				}

				// 增加基础按钮
				tools.push([{
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
					tools.push([{
								text : '审核',
								iconCls : 'system-audit',
								action : 'audit'
							}, {
								text : '反审核',
								iconCls : 'system-unaudit',
								action : 'unaudit'
							}]);
				}

				// 增加打印按钮
				tools.push([{
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