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
			'main.MainTreePanel',
			'main.MainTitle',
			'main.WelcomeIndex',
			'main.PageError'
        ],
        models: ['MainTreeModel'],
		refs:[
	          {ref: 'mainTreePanel',selector: 'maintreepanel'},
	          {ref: 'mainContent',selector: 'maincontent'}
	    ],
		
		init: function(){
			this.control({
				'maintreepanel':{
					afterrender : this.initTreePanel
				},
				'maincontent' : {
					remove : this.closeTab
				}
			});
		},
		
		initTreePanel: function(){
			Ext.Ajax.request({
				url : '../scm/control/getTreeRootData',
				params: {
		        	parentId: '-1'
		        },
		        success : function(response , option) {
		        	var data = Ext.decode(response.responseText);
		        	for(var treeData in data){
		        		this.createTreePanel(this,data[treeData]);
		        	}
		        },
		        failure : function(response, option) {
		        	Ext.Msg.alert(LocaleLang.warning,LocaleLang.canNotLoadData+LocaleLang.exclamationMark); 
		        },
		        scope : this
		    });
		},
		
		createTreePanel: function(self,treeData){
			var tempTree = Ext.create('Ext.tree.Panel', {
	            id: treeData.id,
	            title: treeData.text,
	            rootVisible:false,
	            autoScroll:true,
	            iconCls: treeData.iconCls,
	            store : Ext.create('Ext.data.TreeStore', {
	            	model : 'SCM.model.MainTreeModel',
	                proxy: {
			            type: 'ajax',
			            url: '../scm/control/getTreeDataByParentId?parentId='+treeData.id
			        },
			        sorters: [{
			            property: 'sort',
			            direction: 'ASC'
			        }]
	            }),
	            listeners:{
	            	itemclick : function(tree,record){
	            		self.getMainContent().addTab(record.data);
	            	}
	            }
	        });

	        this.getMainTreePanel().add(tempTree);
		},
		closeTab: function(tabPanel,tab){
			this.getMainContent().removeTab(tab);
		}
	}
);