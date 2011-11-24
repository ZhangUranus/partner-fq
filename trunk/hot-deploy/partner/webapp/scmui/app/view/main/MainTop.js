Ext.define('SCM.view.main.MainTop' ,{
		extend : 'Ext.container.Container',
		alias : 'widget.maintop',
		id : 'main-top',
        height: 45,
        layout : {
        	type : "vbox",
        	align : "stretch"
		},
		items : [
			{
				xtype: 'maintitle'
			}
		],
		initComponent: function(){
			this.callParent(arguments);
		}
	}
);