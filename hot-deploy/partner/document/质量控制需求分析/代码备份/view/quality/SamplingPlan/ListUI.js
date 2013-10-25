/*
 * 定义列表界面 Mark
 */
Ext.define('SCM.view.quality.SamplingPlan.ListUI', {
			extend : 'Ext.grid.Panel',
			requires : ['SCM.extend.toolbar.BaseToolbar'],
			alias : 'widget.samplingplaninfomaintaince',
			title : '抽样计划维护',
			store : 'quality.SamplingPlan.SamplingPlanStore',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							columns : [{
										header : '序号',
										xtype : 'rownumberer',
										width : 40
									}, {
										header : '编码',
										dataIndex : 'number',
										width : 80
									}, {
										header : '名称',
										dataIndex : 'name',
										width : 150
									}, {
										header : '创建者',
										dataIndex : 'creatorName',
										width : 80
									}, {
										header : '最后修改人',
										dataIndex : 'lastUpdaterName',
										width : 80
									}, {
										header : '正常抽样比例(%)',
										dataIndex : 'normalSamplingFraction',
										width : 150,
										renderer: SCM.store.basiccode.percentRenderer
									}, {
										header : '预警/新产品抽样比例(%)',
										dataIndex : 'warningSamplingFraction',
										width : 150,
										renderer: SCM.store.basiccode.percentRenderer
									}, {
										header : '投诉、索赔抽样比例(%)',
										dataIndex : 'complainSamplingFraction',
										width : 150,
										renderer: SCM.store.basiccode.percentRenderer
									}, {
										header : '备注',
										dataIndex : 'description',
										width : 100
									}, {
										xtype : 'datecolumn',
										dataIndex : 'createdStamp',
										width : 150,
										format : 'Y-m-d H:i:s',
										groupable : false,
										text : '创建时间'
									}, {
										xtype : 'datecolumn',
										dataIndex : 'lastUpdatedStamp',
										width : 150,
										format : 'Y-m-d H:i:s',
										groupable : false,
										text : '最后修改时间'
									}],
							dockedItems : [{
										xtype : 'basetoolbar'
									}, {
										dock : 'bottom',
										xtype : 'pagingtoolbar',
										store : 'quality.SamplingPlan.SamplingPlanStore',
										displayInfo : true
									}]
						});
				this.callParent();
				this.store.loadPage(1);
			}
		});
