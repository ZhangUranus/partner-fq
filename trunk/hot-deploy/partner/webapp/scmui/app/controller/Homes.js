/**
 * @Purpose framework controller
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.controller.Homes', {
		extend : 'Ext.app.Controller',
		views: [
			'main.MainTop',
			'main.MainContent',
			'main.MainTree',
			'main.MainTitle',
			'main.WelcomeIndex',
			'main.PageError'
        ],
		models: ['MainTreeModel'],
		init: function(){
			this.control();
		}
	}
);