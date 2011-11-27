/**
 * @Purpose 系统logo版面容器
 * @author jeff-liu
 * @Date 2011-11-24
 */
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