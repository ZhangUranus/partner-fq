Ext.define('SCM.view.basedata.material.ImportUI', {
			extend : 'Ext.window.Window',
			alias : 'widget.materialimportui',
			title : '料品备货数导入',
			layout : 'fit',
			width : SCM.DefaultSize.WINDOW_WIDTH,
			modal : true,// 背景变灰，不能编辑
			collapsible : true,
			resizable : false,

			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {
							items : [{
										xtype : 'form',
										bodyPadding : '10 10 10 10',
										border : 0,
				                        url: '../../scm/control/importMaterialSafeStock',
				                        method:'POST',
				                        defaults: {
				                            anchor: '100%',
				                            allowBlank: false,
				                            msgTarget: 'side',
				                            labelWidth: 70
				                        },
										items : [{
													xtype: 'filefield',
										            id: 'importfile',
										            emptyText: '',
										            fieldLabel: '导入文件',
										            name: 'importfile',
										            buttonText: '...',
												}],
										buttons: [{
										            text: '提交',
										            handler: function(){
										                var form = this.up('form').getForm();
										                if(form.isValid()){
										                    form.submit({
										                        success: function(form, action) {
																	if (action.result.success) {
																		showInfo("处理成功！");
																	} else {
																		showError(action.result.message);
																	}
										                         },
										                         failure: function(form, action) {
										                        	 showError(action.result.message);
										                         }
										                    });
										                }
										            }
										        },{
										            text: '重置',
										            handler: function() {
										                this.up('form').getForm().reset();
										            }
										        }]
									}]
						});
				this.callParent();
			}
		});