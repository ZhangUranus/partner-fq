/**
 * @Purpose 系统框架类
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.Loader.setConfig({enabled:true});
Ext.application({
	name:'SCM',
	appFolder:'app',
	controllers: [//载入系统controller
		'Homes',
		'basedata.UnitController',
		'basedata.WarehouseTypeController',
		'basedata.WarehouseController',
		'basedata.CustomerController',
	],
	launch : function(){//初始化系统主页面
		var viewport = Ext.create('Ext.container.Viewport',{
			id: 'main-view',
			layout: 'border',
			defaults : {
				xtype : 'container'
			},
			listeners: {//监控 改变浏览器大小 事件，调用重新计算布局，刷新布局。
				resize : function() {
					this.doLayout();
				}
			},
			items: [{//系统logo版面
				region : 'north',
				xtype : 'maintop'
			},{
				region : 'center',
				layout : 'border',
				minWidth : 800,
				items : [{//系统树形菜单版面
					region : 'west',
					xtype : 'maintreepanel',
					id : 'main-tree',
					border : 1,
					width : 240
				}, {//系统页面展示版面
					region : 'center',
					id : 'main-content-container',
					layout : 'fit',
					minWidth : 800,
					border : false,
					items : {
						xtype : 'maincontent'
					}
				}]
			},{//系统页脚
				region : 'south',
				id : 'footer',
				height : 20,
				contentEl : "footer-content"
			}]
		});
		viewport.doLayout();  //刷新布局
	}
});