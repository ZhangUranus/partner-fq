/**
 * @Purpose 系统头部容器
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.view.Header', {
			extend : 'Ext.Component',
			alias : 'widget.header',
			id : 'main-top',
			initComponent : function() {
				Ext.applyIf(this, {
							xtype : 'box',
							region : 'north',
							height : 45
						});
				this.callParent(arguments);
			}
		});