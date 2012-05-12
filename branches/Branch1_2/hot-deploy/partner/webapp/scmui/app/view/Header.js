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
						        pack: 'start',
                                align: 'left',
						        type: 'hbox'
						    },
							region : 'north',
							height : 55,
							items : [{
						        xtype: 'image',
						        src : 'images/header-img.png',
						        height : 55,
						        width : 500
						    }]
						});
				this.callParent(arguments);
			}
		});