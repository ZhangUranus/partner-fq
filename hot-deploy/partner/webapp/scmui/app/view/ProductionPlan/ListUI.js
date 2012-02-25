/*
 * 定义物料Bom列表界面 Mark
 */
Ext.define('SCM.view.ProductionPlan.ListUI', {
			extend : 'Ext.container.Container',
			requires : ['SCM.ux.combobox.ComboGrid', 'SCM.ux.grid.ComboColumn'],
			alias : 'widget.productionplan',
			title : '生产计划',
			layout : {
				type : 'fit'
			},
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										name : 'ProductionPlanForm',
										bodyStyle : 'background:#ffc; padding:20px;',
										bodyPadding : 10,
										layout : 'border',
										items : [{
													xtype : 'container',
													height : 80,
													layout : {
														columns : 3,
														type : 'table'
													},
													region : 'north',
													items : [{
																xtype : 'combogrid',
																fieldLabel : '加工件',
																name : 'processedMaterialId',
																valueField : 'materialId',
																displayField : 'materialName',
																store : Ext.create('MaterialBomEditStore'),
																margin : 5,
																matchFieldWidth : false,
																allowBlank : false,
																listConfig : {
																	width : 185,
																	height : SCM.MaxSize.COMBOGRID_HEIGHT,
																	columns : [{
																				header : '编码',
																				dataIndex : 'number',
																				width : 100,
																				hideable : false
																			}, {
																				header : '名称',
																				dataIndex : 'materialName',
																				width : 80,
																				hideable : false
																			}]
																}
															}, {
																xtype : 'label'
															}, {
																xtype : 'label'
															}, {
																xtype : 'numberfield',
																hideTrigger : true,
																fieldLabel : '数量',
																name : 'materialVolume',
																allowBlank : false,
																minValue : 1,
																margin : 5
															}, {
																xtype : 'label'
															}, {
																xtype : 'label'
															}]
												}, {
													xtype : 'gridpanel',
													id : 'ProductionPlan-edit-grid',
													region : 'center',
													store : 'ProductionPlan.ProductionPlanStore',
													columns : [{
																xtype : 'gridcolumn',
																dataIndex : 'WAREHOUSENAME',
																width : 150,
																text : '仓库'
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'MATERIALNAME',
																width : 150,
																text : '物料'
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'MATERIALMODEL',
																width : 100,
																text : '规格型号'
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'UNITNAME',
																width : 100,
																text : '单位'
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'VOLUME',
																text : '耗料数量',
																width : 100
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'STOCKVOLUME',
																text : '库存数量',
																width : 100
															}, {
																xtype : 'gridcolumn',
																dataIndex : 'ISOUT',
																width : 60,
																text : '库存情况',
																renderer: SCM.store.basiccode.warningRenderer
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'PRICE',
																text : '单价',
																width : 100
															}, {
																xtype : 'numbercolumn',
																dataIndex : 'ENDSUM',
																text : '耗料金额',
																width : 100
															}],
													viewConfig : {

													}
												}]
									}]
						});
				me.callParent(arguments);
			}
		});
