Ext.define('SCM.view.MainBar' ,{
		extend: 'Ext.Component',
		alias : 'widget.mainbar',
		width : '100%',
        height: 32,
        autoEl: {
            tag: 'div',
            html:'<p><font size="4" color="blue">仓库管理系统</font></p>'
        },
		initComponent: function(){
			this.callParent(arguments);
		}
	}
);