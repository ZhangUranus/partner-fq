Ext.Loader.setConfig({enabled:true});
Ext.application({
	name:'SCM',
	appFolder:'app',
	controllers: ['Homes'],
	launch : function(){
		var viewport = Ext.create('Ext.container.Viewport',{
			id: 'main-view',
			layout: 'border',
			defaults : {
				xtype : 'container'
			},
			listeners: {
				resize : function() {
					this.doLayout();
				}
			},
			items: [{
				region : 'north',
				xtype : 'maintop'
			},{
				region : 'center',
				layout : 'border',
				minWidth : 800,
				items : [{
					region : 'west',
					xtype : 'maintree',
					id : 'main-tree',
					border : 1,
					width : 240
				}, {
					region : 'center',
					id : 'main-content-container',
					layout : 'fit',
					minWidth : 800,
					border : false,
					items : {
						xtype : 'maincontent'
					}
				}]
			},{
				region : 'south',
				id : 'footer',
				height : 20,
				contentEl : "footer-content"
			}]
		});
		
		viewport.doLayout();
	}
});