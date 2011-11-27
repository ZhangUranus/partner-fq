/**
 * @Purpose 页面展示区域容器
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.view.main.MainContent' ,{
	extend: 'Ext.tab.Panel',
	alias : 'widget.maincontent',
	id : 'main-content',
	tabs : [],	//现有tab数组
	plugins: Ext.create('Ext.ux.TabCloseMenu', {}),	//增加Tab页右键菜单插件
	items : [
		{//主页面Tab，不可关闭
			xtype: 'welcomeindex',
			title: LocaleLang.home,
	        iconCls: 'main-index',
	        closable: false
		}
	],
	initComponent: function(){
		this.callParent(arguments);
	},
	hasTab : function(data) {//判断系统是否已经存在tab页
		return Ext.Array.contains(this.tabs, data.id);
	},
	addTab : function(data){//增加tab页
		if(data.leaf){//判断点击节点是否为叶子节点
			if(!this.hasTab(data)){//判断系统是否已经存在tab
				try {
					this.add({
						xtype: data.hyperlink,
						id : data.id,
						title: data.text,
						iconCls: data.iconCls,
						closable: true
					}).show();
				} catch (e) {//异常时展现出错页面
					this.add({
						xtype: 'pageerror',
						id : data.id,
						title: data.text,
						iconCls: data.iconCls,
						closable: true
					}).show();
				}
				this.tabs.push(data.id);	//将页面添加到存在tab数组
			}else{
				this.setActiveTab(data.id);		//如果tab存在，激活
			}
		}
	},
	removeTab : function(data){//从数组中删除相应tab
		var index = Ext.Array.indexOf(this.tabs, data.id);
		if (index !== false) {
			Ext.Array.erase(this.tabs, index, 1)
		}
	}
});