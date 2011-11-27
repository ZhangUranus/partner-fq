/**
 * @Purpose 主框架控制类
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
        models: ['MainTreeModel'],	//树形菜单model类
		refs:[//增加引用
	          {ref: 'mainTreePanel',selector: 'maintreepanel'},
	          {ref: 'mainContent',selector: 'maincontent'}
	    ],
		
		init: function(){//增加事件监听
			this.control({
				'maintreepanel':{
					afterrender : this.initTreePanel
				},
				'maincontent' : {
					remove : this.closeTab
				}
			});
		},
		
		initTreePanel: function(){//初始化功能模块
			Ext.Ajax.request({
				url : '../scm/control/getTreeRootData',
				params: {
		        	parentId: '-1'
		        },
		        success : function(response , option) {
		        	var data = Ext.decode(response.responseText);
		        	for(var treeData in data){
		        		this.createTreePanel(this,data[treeData]);//创建各模块树形菜单
		        	}
		        },
		        failure : function(response, option) {
		        	Ext.Msg.alert(LocaleLang.warning,LocaleLang.canNotLoadData+LocaleLang.exclamationMark); 
		        },
		        scope : this
		    });
		},
		
		createTreePanel: function(self,treeData){//树形菜单创建方法
			var tempTree = Ext.create('Ext.tree.Panel', {
	            id: treeData.id,
	            title: treeData.text,
	            rootVisible:false,  //根节点不可见
	            autoScroll:true,	//自动滚动条
	            iconCls: treeData.iconCls,
	            store : Ext.create('Ext.data.TreeStore', {
	            	model : 'SCM.model.MainTreeModel',
	                proxy: {
			            type: 'ajax',
			            url: '../scm/control/getTreeDataByParentId?parentId='+treeData.id
			        },
			        sorters: [{//根据sort字段排序
			            property: 'sort',
			            direction: 'ASC'
			        }]
	            }),
	            listeners:{
	            	itemclick : function(tree,record){//在页面展示区域增加tab
	            		self.getMainContent().addTab(record.data);
	            	}
	            }
	        });

	        this.getMainTreePanel().add(tempTree);
		},
		closeTab: function(tabPanel,tab){//关闭tab页
			this.getMainContent().removeTab(tab);
		}
	}
);