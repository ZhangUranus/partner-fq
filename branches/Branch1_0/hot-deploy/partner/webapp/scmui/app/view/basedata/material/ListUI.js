/*
 * 定义物料列表界面 Mark
 */
Ext.define('SCM.view.basedata.material.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.materialinfomaintaince',
			title : '物料',
			height : 497,
			width : 718,
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'basetoolbar',
										region : 'north'
									}, {
										xtype : 'treepanel',
										width : 180,
										title : '',
										region : 'west',
										rootVisible : false,
										split : true,
										store : 'basedata.MaterialTypeTreeStore',
										viewConfig : {

										}
									}, {
										xtype : 'gridpanel',
										title : '',
										region : 'center',
										store : 'basedata.MaterialStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													dataIndex : 'materialTypeName',
													text : '物料类别'
												}, {
													dataIndex : 'id',
													text : 'id',
													hidden : true
												}, {
													dataIndex : 'number',
													text : '编码'
												}, {
													dataIndex : 'name',
													text : '名称'
												}, {
													dataIndex : 'model',
													text : '规格型号'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'defaultPrice',
													text : '默认单价'
												}, {
													dataIndex : 'defaultSupplierName',
													text : '默认供应商'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'safeStock',
													text : '安全库存'
												}, {
													dataIndex : 'defaultUnitName',
													text : '默认计量单位'
												}

										],
										dockedItems : [{
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'basedata.MaterialStore',
													displayInfo : true
												}],
										viewConfig : {

										}
									}]
						});
				me.callParent();
				me.down('gridpanel').store.loadPage(1);
			}
		});
