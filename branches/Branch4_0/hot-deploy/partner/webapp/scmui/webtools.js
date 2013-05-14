Ext.Loader.setConfig({
			enabled : true
		});
Ext.application({
    name: 'SCM',

    appFolder: 'app',

    controllers : ['tools.EntityDataController'],
    
    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items:Ext.create('SCM.view.tools.EntityDataUI')
        });
    }
});