/**
 * @Purpose 主框架控制类
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.controller.Main', {
    requires:['SCM.view.Tree','SCM.view.Login'],
    extend : 'Ext.app.Controller',
    models: ['MenuModel'],
    views : ['Header', 'Menu', 'South', 'TabPanel', 'Viewport', 'WelcomeIndex', 'PageError'],
    refs : [// 增加引用
        {ref : 'menutree',selector : 'menutree'}, 
        {ref : 'tabpanel',selector : 'tabpanel'},
        {ref : 'header',selector : 'header'}
    ],
    init : function() {
        var me = this;
        Ext.Ajax.request({//判断用户是否已经登录
            url:'../scm/control/isLogin',
            success : function(response , option) {
                var result = Ext.decode(response.responseText)
                if(result.success){
	                Ext.getCmp('main-tree').show();
	                Ext.getCmp('main-content').show();
                }else{
                    var win;
	                if(!win){
	                    win = Ext.create('SCM.view.Login').show();
	                }
                    win.down('form').getForm().findField('username').focus(true,true);
                } 
            }
        });
        
        me.control({
            'menutree':{
                show : this.initTreePanel
            },
			'tabpanel' : {
				remove : this.closeTab
			},
            'header button[action=logout]' : {
                click : this.logout
            }
		});
	},
    initTreePanel: function(){//初始化功能模块
        Ext.Ajax.request({
            url : '../scm/control/getTreeDataByParentId',
            params: {
                parentId: '-1',
                flag : 'false'
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
    createTreePanel: function(self,treeData) {
        var tempTree = Ext.create('Ext.tree.Panel', {
            id: treeData.id,
            title: treeData.text,
            rootVisible:false,  //根节点不可见
            autoScroll:true,    //自动滚动条
            iconCls: treeData.iconCls,
            store : Ext.create('Ext.data.TreeStore', {
                model : 'SCM.model.MenuModel',
                autoLoad: false,
                autoSync: true,
                proxy: {
                    type: 'ajax',
                    url: '../scm/control/getTreeDataByParentId?flag=true&parentId='+treeData.id
                },
                sorters: [{//根据sort字段排序
                    property: 'sort',
                    direction: 'ASC'
                }]
            }),
            listeners:{
                itemclick : function(tree,record){//在页面展示区域增加tab
                	if(!self.getTabpanel().hasTab(record.data)){//判断页面是否已经打开
	                    Ext.Ajax.request({
				            url:'../scm/control/getUserPermissions?menuId='+record.get("id"),
				            success : function(response , option) {
	                            var permission = Ext.decode(response.responseText);
	                            //var permission = Ext.decode("{edit: true,add: true,remove: true,view:false}");
				                self.getTabpanel().addTab(record.data,permission);
				            }
				        });
                	}else{
                		self.getTabpanel().setActiveTab(record.data.id);
                	}
                }
            }
        });
        this.getMenutree().add(tempTree);
    },
    closeTab : function(tabPanel, tab) {// 关闭tab页
        this.getTabpanel().removeTab(tab);
    },
    logout : function() {//注销
        Ext.Ajax.request({//判断用户是否已经登录
            url:'../scm/control/logout',
            success : function(response , option) {
                Ext.Msg.alert("提示","你已经注销！",new Function("window.location = window.location;"));
            }
        });
    }
})