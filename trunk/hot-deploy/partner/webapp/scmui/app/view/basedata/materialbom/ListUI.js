/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.basedata.materialbom.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.bombillinfomaintaince',
			title : '物料BOM',
			layout : {
				type : 'border'
			},

			initComponent : function() {
				var me = this;
				var entryStore = Ext.create('MaterialBomEditEntryStore');
				Ext.applyIf(me, {
							items : [{
										xtype : 'basetoolbar',
										bomBill : true,
										region : 'north'
									}, {
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										title : '',
										region : 'center',
										store : 'basedata.MaterialBomEditStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'number',
													width : 150,
													text : 'BOM编码'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.auditStatusRenderer,
													dataIndex : 'status',
													width : 100,
													text : '状态'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.validRenderer,
													dataIndex : 'valid',
													width : 100,
													text : '是否有效'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'note',
													width : 200,
													text : 'BOM备注'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialNumber',
													width : 150,
													text : '物料编码'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'materialName',
													width : 150,
													text : '物料名称'
												}],
										dockedItems : [{
													dock : 'bottom',
													xtype : 'pagingtoolbar',
													store : 'basedata.MaterialBomEditStore',
													displayInfo : true
												}],
										viewConfig : {

										}
									}, {
										xtype : 'gridpanel',
										title : '',
										region : 'south',
										height : 190,
										split : true,
										store : entryStore,
										columns : [{
													xtype : 'gridcolumn',
													dataIndex : 'entryMaterialName',
													width : 150,
													text : '物料名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'entryMaterialModel',
													width : 120,
													text : '物料规格型号'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'volume',
													width : 120,
													text : '数量'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'entryUnitName',
													width : 120,
													text : '计量单位'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.validRenderer,
													dataIndex : 'isBomMaterial',
													width : 100,
													text : '是否BOM物料'
												}]
									}]
						});
				me.callParent();
			}
		});
