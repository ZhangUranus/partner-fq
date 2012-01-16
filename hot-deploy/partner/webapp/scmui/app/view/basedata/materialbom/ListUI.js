/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.basedata.materialbom.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.bombillinfomaintaince',
			title : '物料BOM',
			store : 'basedata.MaterialBomStore',
			height : 497,
			width : 718,

			initComponent : function() {
				var me = this;
				var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
					groupHeaderTpl : 'BOM编码:{name}  (分录数量 {rows.length})',
					groupByText : '用本字段分组',
					showGroupsText : '显示分组',
					startCollapsed : false
						// 设置初始分组是否收起
					});
				Ext.applyIf(me, {
							features : [groupingFeature],
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
										xtype : 'gridcolumn',
										dataIndex : 'number',
										width : 150,
										text : 'BOM编码'
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'materialName',
										width : 150,
										groupable : false,
										text : '物料名称'
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'bomMaterialNum',
										width : 150,
										groupable : false,
										text : 'BOM物料名称'
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'bomMaterialModel',
										width : 150,
										groupable : false,
										text : 'BOM物料规格型号'
									}, {
										xtype : 'numbercolumn',
										dataIndex : 'volume',
										groupable : false,
										text : '数量'
									}, {
										xtype : 'gridcolumn',
										dataIndex : 'unitName',
										groupable : false,
										text : '计量单位'
									}

							],
							dockedItems : [{
										xtype : 'basetoolbar'
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'basedata.MaterialBomStore',
										displayInfo : true
									}]
						});
				me.callParent();
				this.store.loadPage(1);
			}
		});
