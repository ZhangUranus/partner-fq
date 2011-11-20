Ext.define('SCM.view.ContentPanel' ,{
		extend: 'Ext.tab.Panel',
		alias : 'widget.contentpanel',
		frameHeader: false,
		items : [
			{
				title: '首页',
				html: 'Hello world 1'
			}
		],
		initComponent: function(){
			this.callParent(arguments);
		}
	}
);