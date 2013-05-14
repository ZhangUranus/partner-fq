Ext.define('SCM.controller.rpt.RptTestController', {
			extend : 'Ext.app.Controller',
			views : ['SCM.view.rpt.RptTestUI'],
			stores : ['SCM.store.rpt.RptTestStore'],
			init : function() {
				this.control({
							'RptTestUI button[action=addNew]' : {
								click:this.fetchData()
							}
				})
			},
			
			fetchData : function(){
			}
			
});