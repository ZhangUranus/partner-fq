/**
 * @Purpose 系统头部容器
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.view.Header', {
			extend : 'Ext.container.Container',
			alias : 'widget.header',
			id : 'main-top',
			initComponent : function() {
				Ext.applyIf(this, {
                            layout: {
						        pack: 'end',
                                align: 'middle',
						        type: 'hbox'
						    },
							region : 'north',
							height : 45,
                            items : [
                                {
                                    xtype: 'button',
                                    action : 'logout',
                                    text:'注销'
                                }
                            ]
						});
				this.callParent(arguments);
			}
		});