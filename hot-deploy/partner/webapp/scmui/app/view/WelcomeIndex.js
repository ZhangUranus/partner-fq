/**
 * @Purpose 我的首页
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define("SCM.view.WelcomeIndex", {
		extend : "Ext.container.Container",
		alias : "widget.welcomeindex",
		html : 'hello ,i am index page!',
		initComponent : function() {
			this.callParent(arguments)
		}
	}
);