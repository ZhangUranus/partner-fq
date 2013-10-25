Ext.define('SCM.view.quality.SamplingPlan.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar'],
			alias : 'widget.samplingplanedit',
			title : '抽样计划',
			layout : 'fit',
			width : SCM.MaxSize.WINDOW_WIDTH,
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,
			closeAction : 'hide',
			uiStatus : 'AddNew',
			inited : false, // 初始化标识
			modifyed : false, // 修改标识

			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										bodyPadding : '10 10 10 10',
										border : 0,
										defaults : {
											xtype : 'textfield',
											labelWidth : SCM.MaxSize.LABEL_WIDTH,
											width : SCM.MaxSize.FIELD_WIDTH
										},
										items : [{
													name : 'id',
													fieldLabel : 'id',
													hidden : true
												}, {
													name : 'number',
													fieldLabel : '编码',
													emptyText : '保存时系统自动生成',
													readOnly : true
												}, {
													name : 'name',
													fieldLabel : '名称',
													allowBlank : false,
													maxLength : 50
												}, {
													xtype : 'numberfield',
													hideTrigger: true,
													name : 'normalSamplingFraction',
													fieldLabel : '正常抽样比例'
												}, {
													xtype : 'numberfield',
													hideTrigger: true,
													name : 'warningSamplingFraction',
													fieldLabel : '预警抽样比例'
												}, {
													xtype : 'numberfield',
													hideTrigger: true,
													name : 'complainSamplingFraction',
													fieldLabel : '投诉抽样比例'
												}, {
													xtype : 'textarea',
													name : 'description',
													fieldLabel : '备注',
													maxLength : 254
												}, {
													xtype : 'label',
													text : '注意：抽样比例请填写小数代替，例如：0.1=10%，0.01=1% 。',
													colspan : 2,
													style : {
														'font-weight' : 'bold',
														'color' : 'red',
														'font-size' : 12
													}
												}]
									}],
							dockedItems : [{
										xtype : 'savetoolbar',
										dock : 'bottom'
									}]
						});
				this.callParent();
			},

			close : function() {
				this.hide();
				this.inited = false;
				this.modifyed = false;
			}
		});