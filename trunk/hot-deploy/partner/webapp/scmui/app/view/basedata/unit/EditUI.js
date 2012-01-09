Ext.define('SCM.view.basedata.unit.EditUI', {
			extend : 'Ext.window.Window',
			alias : 'widget.unitedit',

			title : '计量单位',
			layout : 'fit',
			height: 80,
            width: 280,
			//autoShow: true,
			modal : true,//背景变灰，不能编辑
			uiStatus : 'AddNew',
			inited : false, //初始化标识
			modifyed : false, //修改标识

			initComponent : function() {
				this.initForm();
				this.initToolbar();
				this.callParent(arguments);
			},

			close : function() {
				this.hide();
				this.inited = false;
				this.modifyed = false;
			},
			//初始化表单
			initForm : function() {
				this.items = [{
							xtype : 'form',
							bodyPadding : 5,
							items : [{
										xtype : 'textfield',
										name : 'id',
										fieldLabel : 'id',
										hidden : true
									}, {
										xtype : 'textfield',
										name : 'number',
										fieldLabel : '编码',
										hidden : true
									}, {
										xtype : 'textfield',
										name : 'name',
										fieldLabel : '名称',
										allowBlank : false,
										maxLength : 50
									}]
						}];
			},

			//初始化工具栏
			initToolbar : function() {
				this.dockedItems = [{
							xtype : 'toolbar',
							height: 28,
							items : [{
										text : '保存',
										iconCls : 'system-save',
										action : 'save'
									}]
						}];
			}

		});