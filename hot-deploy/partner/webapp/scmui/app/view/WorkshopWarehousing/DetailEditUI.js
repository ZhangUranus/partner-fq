Ext.define('SCM.view.WorkshopWarehousing.DetailEditUI', {
	extend : 'Ext.window.Window',
	requires : [ 'SCM.extend.toolbar.SaveToolbar', 'SCM.extend.toolbar.GridEditToolbar', 'SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn' ],
	alias : 'widget.WorkshopWarehousingdetailedit',
	height : SCM.DefaultSize.WINDOW_HEIGHT,
	width : 550,
	title : '耗料明细',
	layout : 'border',
	modal : true,// 背景变灰，不能编辑
	collapsible : true,
	resizable : false,
	closeAction : 'hide',
	uiStatus : 'AddNew',
	inited : false,
	modifyed : false,
	initComponent : function() {
		var me = this;
		var cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
			clicksToEdit : 1
		});
		var entryStore = Ext.create('WorkshopWarehousingDetailStore');
		Ext.applyIf(me, {
			items : [ {
				xtype : 'gridpanel',
				id : 'WorkshopWarehousing-detail-edit-grid',
				region : 'center',
				border : 0,
				store : entryStore,
				columns : [ {
					xtype : 'gridcolumn',
					dataIndex : 'parentId',
					text : 'parentId',
					hidden : true
				}, {
					xtype : 'combocolumn',
					dataIndex : 'materialId',
					text : '物料',
					gridId : 'WorkshopWarehousing-detail-edit-grid',
					editor : {
						xtype : 'combogrid',
						valueField : 'id',
						displayField : 'name',
						initStore : Ext.data.StoreManager.lookup('MComboInitStore'),
						store : Ext.data.StoreManager.lookup('MComboStore'),
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
					}
				}, {
					xtype : 'gridcolumn',
					dataIndex : 'materialModel',
					text : '规格型号'
				}, {
					xtype : 'numbercolumn',
					editor : {
						xtype : 'numberfield',
						allowBlank : false,
						hideTrigger : true
					},
					dataIndex : 'volume',
					text : '数量',
					width : 80
				}, {
					xtype : 'combocolumn',
					dataIndex : 'materialUnitId',
					text : '单位',
					gridId : 'WorkshopWarehousing-detail-edit-grid',
					editor : {
						xtype : 'combobox',
						valueField : 'id',
						displayField : 'name',
						initStore : Ext.data.StoreManager.lookup('UComboInitStore'),
						store : Ext.data.StoreManager.lookup('UComboStore'),
						readOnly : true
					},
					width : 80
				}, {
					xtype : 'numbercolumn',
					dataIndex : 'price',
					text : '单价',
					width : 80
				}, {
					xtype : 'numbercolumn',
					dataIndex : 'entrysum',
					text : '金额',
					width : 80
				} ],
				viewConfig : {},
				plugins : [ cellEditing ],
				dockedItems : [ {
					xtype : 'toolbar',
					items : [ {
						text : '添加耗料',
						iconCls : 'bill-addline',
						action : 'addLine'
					}, {
						text : '删除耗料',
						iconCls : 'bill-dline',
						action : 'deleteLine'
					} ],
					dock : 'top'
				} ]
			}, {
				xtype : 'label',
				region : 'south',
				height : 20,
				text : '该列表为加工件的总耗料，其中单价、金额在单据提交后才能显示！',
				style : {
					color : 'red'
				}
			} ],
			dockedItems : [ {
				xtype : 'savetoolbar',
				type : 'simple',
				dock : 'bottom'
			} ]
		});
		this.callParent(arguments);
	},
	close : function() {
		this.hide();
		this.inited = false;
		this.modifyed = false;
	}
});