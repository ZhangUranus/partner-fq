Ext.define('SCM.view.basedata.region.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar'],
			alias : 'widget.regionedit',
			title : '地区',
			layout : 'fit',
			width : SCM.MinSize.WINDOW_WIDTH,
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
											labelWidth : SCM.MinSize.LABEL_WIDTH,
											width : SCM.MinSize.FIELD_WIDTH
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
													xtype : 'textarea',
													name : 'description',
													fieldLabel : '描述',
													maxLength : 127
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