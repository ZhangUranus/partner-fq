/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.rpt.pkm.ListUI', {
			extend : 'Ext.container.Container',
			alias : 'widget.packingmaterialreport',
			title : '安装包装材料表',
			layout : {
				type : 'border'
			},
			initComponent : function() {
				var me = this;
				var today = new Date();
				var startDay = new Date(today.getFullYear(), today.getMonth(), 1);
				Ext.applyIf(me, {
							items : [{
										xtype : 'toolbar',
										height : 28,
										region : 'north',
										defaults : {
											margin : '0 0 0 0',
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
													name : 'searchWarehouseId',
													width : 145,
													labelWidth : 35,
													fieldLabel : '仓库',
													store : Ext.create('WarehouseStore'),
													valueField : 'id',
													displayField : 'name',
													matchFieldWidth : false,
													emptyText : '所有仓库',
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
										xtype : 'gridpanel',
										margin : '1 0 0 0',
										title : '',
										region : 'center',
										store : 'rpt.PackingMaterialReportStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'datecolumn',
													dataIndex : 'BIZ_DATE',
													width : 120,
													format : 'Y-m-d',
													groupable : false,
													text : '业务日期'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'NUMBER',
													width : 150,
													text : '单据编码'
												}, {
													xtype : 'gridcolumn',
													renderer : SCM.store.basiccode.billStatusRenderer,
													dataIndex : 'STATUS',
													width : 60,
													groupable : false,
													text : '单据状态'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'WAREHOUSENAME',
													width : 120,
													groupable : false,
													text : '仓库'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIALNAME',
													width : 120,
													groupable : false,
													text : '包装名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIALMODEL',
													width : 80,
													groupable : false,
													text : '规格型号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'UNITNAME',
													width : 80,
													groupable : false,
													text : '单位'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'VOLUME',
													width : 90,
													groupable : false,
													text : '数量'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'PRICE',
													width : 90,
													groupable : false,
													text : '单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENTRYSUM',
													width : 90,
													groupable : false,
													text : '总金额'
												}],
										viewConfig : {

										}
									}, {
										xtype : 'gridpanel',
										title : '',
										region : 'south',
										height : 250,
										split : true,
										store : 'rpt.PackingMaterialDetailStore',
										columns : [{
													header : '序号',
													xtype : 'rownumberer',
													width : 40
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIALNUMBER',
													text : '物料编号'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'MATERIALNAME',
													text : '物料名称'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'PERVOLUME',
													text : '单位耗料'
												}, {
													xtype : 'gridcolumn',
													dataIndex : 'VOLUME',
													text : '总耗料'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'PRICE',
													text : '单价'
												}, {
													xtype : 'numbercolumn',
													dataIndex : 'ENTRYSUM',
													text : '金额'
												}]
									}]
						});
				me.callParent(arguments);
				// me.down('gridpanel').store.load();
			}
		});
