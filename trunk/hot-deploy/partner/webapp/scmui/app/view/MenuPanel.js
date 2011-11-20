Ext.define('SCM.view.MenuPanel' ,{
		extend: 'Ext.panel.Panel',
		alias : 'widget.menupanel',
		title : '功能菜单',
		width: 200,
		split: true,
		collapsible: true,
		animCollapse: true,
        height: 32,
		initComponent: function(){
			this.callParent(arguments);
		}
	}
);