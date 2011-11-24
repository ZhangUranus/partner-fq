Ext.define('SCM.controller.Homes', {
		extend : 'Ext.app.Controller',
		views: [
			'main.MainTop',
			'main.MainContent',
			'main.MainTree',
			'main.MainTitle',
			'main.WelcomeIndex'
        ],
		init: function(){
			this.control();
		}
	}
);