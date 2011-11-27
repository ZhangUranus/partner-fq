/**
 * @Purpose page container
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.view.main.MainContent' ,{
	extend: 'Ext.tab.Panel',
	alias : 'widget.maincontent',
	id : 'main-content',
	tabs : [],
	plugins: Ext.create('Ext.ux.TabCloseMenu', {}),
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
	},
	hasTab : function(data) {
		return Ext.Array.contains(this.tabs, data.id);
	},
	addTab : function(data){
		if(data.leaf){
			if(!this.hasTab(data)){
				try {
					this.add({
						xtype: data.hyperlink,
						id : data.id,
						title: data.text,
						iconCls: data.iconCls,
						closable: true
					}).show();
				} catch (e) {
					this.add({
						xtype: 'pageerror',
						id : data.id,
						title: data.text,
						iconCls: data.iconCls,
						closable: true
					}).show();
				}
				this.tabs.push(data.id);
			}else{
				this.setActiveTab(data.id);
			}
		}
	},
	removeTab : function(data){
		var index = Ext.Array.indexOf(this.tabs, data.id);
		if (index !== false) {
			Ext.Array.erase(this.tabs, index, 1)
		}
	}
});