/**
 * @Purpose menu tree
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.view.main.MainTreePanel', {
		extend : 'Ext.panel.Panel',
		alias : 'widget.maintreepanel',
		title : LocaleLang.menu,
		collapsible : true,
		animCollapse : true,
        height: 32,
        layout:'accordion',
		initComponent: function(){
			this.callParent(arguments);
		}
	}
);