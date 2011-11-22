Ext.define('SCM.view.LoginPanel' ,{
		extend: 'Ext.window.Window',
		alias : 'widget.loginpanel',
		title: '登录',
	    width: 300,
	    height: 170,
	    items: [
	    	{
				title: '首页',
				html: 'Hello world 1'
			}
	    ],
		initComponent: function(){
			this.show();
		    
			this.callParent(arguments);
		}
	}
);