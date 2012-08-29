Ext.define('SCM.extend.toolbar.BillSearchToolbar', {
			extend : 'Ext.toolbar.Toolbar',
			alias : 'widget.billsearchtoolbar',
			initComponent : function() {
				var me = this;
				var today = new Date();
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
							xtype : 'combobox',
							name : 'status',
							width : 145,
							labelWidth : 60,
							fieldLabel : '单据状态',
							valueField : 'id',
							displayField : 'name',
							store : SCM.store.basiccode.billStatusStore,
							emptyText : '所有状态'
						}];

				// 增加供应商/车间/加工商/客户等条件
				if (me.custType) {
					var label = '';
					var labelWidth = 0;
					var custStore;
					if (me.custType == 'supplier') {
						label = '供应商';
						labelWidth = 45;
						custStore = Ext.data.StoreManager.lookup('SPComboStore');
					} else if (me.custType == 'workshop') {
						label = '车间';
						labelWidth = 35;
						custStore = Ext.data.StoreManager.lookup('WSComboStore');
					} else if (me.custType == 'processor') {
						label = '加工商';
						labelWidth = 45;
						custStore = Ext.data.StoreManager.lookup('SPComboStore');
					} else if (me.custType == 'customer') {
						label = '客户';
						labelWidth = 35;
						custStore = Ext.create('CustomerStore');
					} else if (me.custType == 'warehouse') {
						label = '仓库';
						labelWidth = 35;
						custStore = Ext.data.StoreManager.lookup('WHComboStore');
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
								emptyText : '所有' + label,
								listConfig : {
									width : 300,
									height : SCM.MaxSize.COMBOGRID_HEIGHT,
									columns : [{
												header : '编码',
												dataIndex : 'number',
												width : 100,
												hideable : false
											}, {
												header : '名称',
												dataIndex : 'name',
												width : 180,
												hideable : false
											}]
								}
							}]);
				}
				
				if (me.keyWord) {
					tools = tools.concat([{
								xtype : 'textfield',
								name : 'searchKeyWord',
								minWidth : 150,
								emptyText : '请输入物料名称或编码'
							}]);
				} else {
					tools = tools.concat([{
								xtype : 'combogrid',
								name : 'searchMaterialId',
								width : 145,
								labelWidth : 35,
								fieldLabel : '物料',
								valueField : 'id',
								displayField : 'name',
								store : Ext.data.StoreManager.lookup('MComboStore'),
								matchFieldWidth : false,
								emptyText : '所有物料',
								listConfig : {
									width : 400,
									height : SCM.MaxSize.COMBOGRID_HEIGHT,
									columns : [{
												header : '编码',
												dataIndex : 'number',
												width : 100,
												hideable : false
											}, {
												header : '名称',
												dataIndex : 'name',
												width : 280,
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