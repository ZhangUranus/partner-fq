Ext.define('SCM.view.quality.CheckProject.EditUI', {
			extend : 'Ext.window.Window',
			requires : ['SCM.extend.toolbar.SaveToolbar'],
			alias : 'widget.checkprojectedit',
			title : '检验项目',
			layout : 'fit',
			width : SCM.DefaultSize.WINDOW_WIDTH,
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
											labelWidth : SCM.DefaultSize.LABEL_WIDTH,
											width : SCM.DefaultSize.FIELD_WIDTH
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
													name : 'checkRequire',
													fieldLabel : '检验要求',
													maxLength : 254
												}, {
													xtype : 'textarea',
													name : 'checkMethod',
													fieldLabel : '检验方法',
													maxLength : 254
												}, {
													xtype : 'textarea',
													name : 'reference',
													fieldLabel : '参考文件',
													maxLength : 254
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