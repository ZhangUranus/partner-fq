Ext.define('SCM.view.MenuPanel' ,{
		extend: 'Ext.panel.Panel',
		alias : 'widget.menupanel',
		title : '功能菜单',
		width: 200,
		split: true,
		collapsible: true,
		animCollapse: true,
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
	            iconCls: treeData.cls,
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
	        this.add(tempTree);
		}
	}
);