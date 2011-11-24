Ext.define('SCM.view.main.MainTree', {
		extend : 'Ext.panel.Panel',
		alias : 'widget.maintree',
		title : '功能菜单',
		collapsible : true,
		animCollapse : true,
        height: 32,
        layout:'accordion',
		initComponent: function(){
			Ext.Ajax.request({
				url : '../scm/control/getTreeRootData',
				params: {
		        	parentId: '-1'
		        },
		        success : function(response , option) {
		        	var data = Ext.decode(response.responseText);
		        	for(var treeData in data){
		        		this.createTreePanel(data[treeData]);
		        	}
		        },
		        failure : function(response, option) {
		        	Ext.Msg.alert('警告','数据载入失败！'); 
		        },
		        scope : this
		    });
			this.callParent(arguments);
		},
		createTreePanel: function(treeData){
			var tempTree = Ext.create('Ext.tree.Panel', {
	            id: treeData.id,
	            title: treeData.text,
	            rootVisible:false,
	            autoScroll:true,
	            iconCls: treeData.iconCls,
	            store : Ext.create('Ext.data.TreeStore', {
	                proxy: {
			            type: 'ajax',
			            url: '../scm/control/getTreeDataByParentId?parentId='+treeData.id
			        },
			        sorters: [{
			            property: treeData.sort,
			            direction: 'ASC'
			        }]
	            })
	        });
	        
	        tempTree.getSelectionModel().on('select', function(selModel, record) {
		        if (record.get('leaf')) {
		            Ext.getCmp('main-content').add({
		            	xtype: 'welcomeindex',
		            	title: record.data.text,
		            	iconCls: record.data.iconCls,
		            	html : record.data.text,
		            	closable: true
		            }).show();
		            
		        }
		    });
	        
	        this.add(tempTree);
		}
	}
);