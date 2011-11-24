Ext.define('SCM.view.main.MainContent' ,{
		extend: 'Ext.tab.Panel',
		alias : 'widget.maincontent',
		id : 'main-content',
		items : [
			{
				xtype: 'welcomeindex',
				title: '我的首页',
		        iconCls: 'main-index',
		        closable: false
			}
		],
		initComponent: function(){
			this.callParent(arguments);
		}
	}
);