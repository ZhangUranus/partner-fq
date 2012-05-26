Ext.Loader.setConfig({
			enabled : true
		});
Ext.application({
    name: 'SCM',

    appFolder: 'app',

    controllers : ['rpt.RptTestController'],
    
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items:Ext.create('RptTestUI')
        });
    }
});