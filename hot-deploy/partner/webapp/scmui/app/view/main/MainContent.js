/**
 * @Purpose page container
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.view.main.MainContent' ,{
		extend: 'Ext.tab.Panel',
		alias : 'widget.maincontent',
		id : 'main-content',
		items : [
			{
				xtype: 'welcomeindex',
				title: LocaleLang.home,
		        iconCls: 'main-index',
		        closable: false
			}
		],
		initComponent: function(){
			this.callParent(arguments);
		}
	}
);