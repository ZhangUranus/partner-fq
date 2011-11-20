Ext.Loader.setConfig({enabled:true});
Ext.application({
	name:'SCM',
	appFolder:'app',
	controllers: ['Homes'],
	launch : function(){
			var viewport = Ext.create('Ext.container.Viewport',{
				id: 'main-view',
				layout: 'border',
				items: [
					{
						region: 'north',
						xtype: 'mainbar'
					},{
						region: 'west',
						xtype: 'menupanel'
					},{
						region: 'center',
						xtype: 'contentpanel'
					}
				]
			});
	}
});