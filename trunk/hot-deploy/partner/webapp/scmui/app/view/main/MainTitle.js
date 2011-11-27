/**
 * @Purpose 系统logo页面
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.view.main.MainTitle' ,{
		extend : 'Ext.container.Container',
		alias : 'widget.maintitle',
		id : 'main-title',
		height : 45,
		xtype : 'container',
		initComponent: function(){
			this.callParent(arguments);
		}
	}
);