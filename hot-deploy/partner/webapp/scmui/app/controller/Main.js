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
        {ref : 'menu',selector : 'menu'}, 
        {ref : 'tabpanel',selector : 'tabpanel'}
    ],
    init : function() {
        var me = this;
        
//        var win;
//        if(!win){
//            win = Ext.create('SCM.view.Login').show();
//        }
        me.control({
            'menu':{
                    afterrender : this.initTreePanel
            },
			'tabpanel' : {
				remove : me.closeTab
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
                    self.getTabpanel().addTab(record.data);
                }
            }
        });
        this.getMenu().add(tempTree);
    },
    closeTab : function(tabPanel, tab) {// 关闭tab页
        this.getTabpanel().removeTab(tab);
    }
})