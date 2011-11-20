Ext.define('SCM.controller.Homes', {
		extend : 'Ext.app.Controller',
		views: [
		        'MainBar',
		        'MenuPanel',
		        'ContentPanel'
        ],
		init: function(){
			this.control();
		}
	}
);