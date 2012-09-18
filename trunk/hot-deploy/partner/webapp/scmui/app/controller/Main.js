/**
 * @Purpose 主框架控制类
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.controller.Main', {
			requires : ['SCM.view.Tree', 'SCM.view.Login'],
			extend : 'Ext.app.Controller',
			models : ['MenuModel'],
			views : ['Header', 'Menu', 'South', 'TabPanel', 'Viewport', 'WelcomeIndex', 'PageError'],
			refs : [// 增加引用
			{
						ref : 'menutree',
						selector : 'menutree'
					}, {
						ref : 'tabpanel',
						selector : 'tabpanel'
					}, {
						ref : 'header',
						selector : 'header'
					}],
			init : function() {
				var me = this;
				Ext.Ajax.request({//判断用户是否已经登录
					url : '../scm/control/isLogin',
					success : function(response, option) {
						var result = Ext.decode(response.responseText)
						if (result.success) {
							Ext.getCmp("current-user-label").setText(result.currentUser.userName);
							Ext.getCmp("current-date-label").setText(result.currentYear + "年" + result.currentMonth + "月");
							SCM.SystemMonthlyYear = result.currentYear;
							SCM.SystemMonthlyMonth = result.currentMonth;
							SCM.CurrentUser = result.currentUser;
							Ext.getCmp('main-tree').show();
							Ext.getCmp('main-content').show();
						} else {
							var win;
							if (!win) {
								win = Ext.create('SCM.view.Login').show();
							}
							win.down('form').getForm().findField('USERNAME').focus(true, true);
							var map = new Ext.util.KeyMap(win.getEl(), [{
								scope : win,
								key : Ext.EventObject.ENTER,
								fn : win.login
							}]);
						}
					}
				});

				me.control({
							'menutree' : {
								show : this.initTreePanel
							},
							'tabpanel' : {
								remove : this.closeTab
							},
							'south button[action=logout]' : {
								click : this.logout
							},
							'south button[action=help]' : {
								click : this.downloadHelp
							}
						});
						
				this.initStore();
				
			},
			
			/**
			 * 初始化系统全局store
			 */
			initStore : function() {
				
				/* 初始化物料分类的STORE */
				Ext.create('MaterialTypeStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'MTComboStore' //下拉框－－选择时使用
						}).load();
				Ext.create('MaterialTypeStore', {
							pageSize : SCM.unpageSize,
							storeId : 'MTComboInitStore' //下拉框－－展现时使用
						}).load();
				
				/* 初始化物料的STORE */
				/* 普通物料 */
				Ext.create('MaterialComboStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'MComboStore' //下拉框－－选择时使用
						}).load();
				Ext.create('MaterialComboStore', {
							pageSize : SCM.unpageSize,
							storeId : 'MComboInitStore' //下拉框－－展现时使用
						}).load();

				/* 包括仓库字段的物料 store */
				Ext.create('MaterialWarehouseComboStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'MWHComboStore' //下拉框－－选择时使用
						}).load();
				Ext.create('MaterialWarehouseComboStore', {
							pageSize : SCM.unpageSize,
							storeId : 'MWHComboInitStore' //下拉框－－展现时使用
						}).load();
				/* 只用于物料查找，下拉框不能使用该store */
				Ext.create('MaterialComboStore', {
							pageSize : SCM.unpageSize,
							storeId : 'MAllStore' //物料的Store
						}).load();

				/* 初始化物料BOM的STORE */
				/* 普通物料BOM */
				Ext.create('MaterialBomComboStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'MBComboStore' //下拉框－－选择时使用
						}).load();
				Ext.create('MaterialBomComboStore', {
							pageSize : SCM.unpageSize,
							storeId : 'MBComboInitStore' //下拉框－－展现时使用
						}).load();

				/* 包括仓库字段的物料BOM store */
				Ext.create('MaterialBomWarehouseComboStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'MBWHComboStore' //下拉框－－选择时使用
						}).load();
				Ext.create('MaterialBomWarehouseComboStore', {
							pageSize : SCM.unpageSize,
							storeId : 'MBWHComboInitStore' //下拉框－－展现时使用
						}).load();

				/* 只用于物料BOM查找，下拉框不能使用该store */
				Ext.create('MaterialBomStore', {
							storeId : 'MBAllStore' //物料BOM的Store
						}).load();

				/* 初始化供应商的STORE */
				Ext.create('SupplierStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'SPComboStore' //下拉框－－选择时使用
						}).load();

				Ext.create('SupplierStore', {
							pageSize : SCM.unpageSize,
							storeId : 'SPComboInitStore' //下拉框－－展现时使用
						}).load();
				
				/* 初始化客户的STORE */
				Ext.create('CustomerStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'CComboStore' //下拉框－－选择时使用
						}).load();

				Ext.create('CustomerStore', {
							pageSize : SCM.unpageSize,
							storeId : 'CComboInitStore' //下拉框－－展现时使用
						}).load();

				/* 初始化车间的STORE */
				Ext.create('WorkshopStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'WSComboStore' //下拉框－－选择时使用
						}).load();

				Ext.create('WorkshopStore', {
							pageSize : SCM.unpageSize,
							storeId : 'WSComboInitStore' //下拉框－－展现时使用
						}).load();

				/* 初始化仓库的STORE */
				Ext.create('WarehouseStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'WHComboStore' //下拉框－－选择时使用
						}).load();
				Ext.create('WarehouseStore', {
							pageSize : SCM.unpageSize,
							storeId : 'WHComboInitStore' //下拉框－－展现时使用
						}).load();

				/* 初始化计量单位的STORE */
				Ext.create('UnitStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'UComboStore' //下拉框－－选择时使用
						}).load();
				Ext.create('UnitStore', {
							pageSize : SCM.unpageSize,
							storeId : 'UComboInitStore' //下拉框－－展现时使用
						}).load();

				/* 初始化系统用户的STORE */
				Ext.create('SystemUserStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'SUComboStore' //下拉框－－选择时使用
						}).load();

				Ext.create('SystemUserStore', {
							pageSize : SCM.unpageSize,
							storeId : 'SUComboInitStore' //下拉框－－展现时使用
						}).load();

				/* 初始化地区的STORE */
				Ext.create('RegionStore', {
							pageSize : SCM.comboPageSize,
							storeId : 'RGComboStore' //下拉框－－选择时使用
						}).load();
				Ext.create('RegionStore', {
							pageSize : SCM.unpageSize,
							storeId : 'RGComboInitStore' //下拉框－－展现时使用
						}).load();

				/* 初始化月份的STORE */
				Ext.create('MonthStore', {
							storeId : 'MTHComboStore' //下拉框－－展现时使用
						}).load();
			},

			initTreePanel : function() {//初始化功能模块
				Ext.Ajax.request({
							url : '../scm/control/getTreeDataByParentId',
							params : {
								parentId : '-1',
								flag : 'false'
							},
							success : function(response, option) {
								var data = Ext.decode(response.responseText);
								for (var treeData in data) {
									this.createTreePanel(this, data[treeData]);//创建各模块树形菜单
								}
							},
							failure : function(response, option) {
								Ext.Msg.alert(LocaleLang.warning, LocaleLang.canNotLoadData + LocaleLang.exclamationMark);
							},
							scope : this
						});
			},
			createTreePanel : function(self, treeData) {
				var tempTree = Ext.create('Ext.tree.Panel', {
							id : treeData.id,
							title : treeData.text,
							rootVisible : false, //根节点不可见
							autoScroll : true, //自动滚动条
							iconCls : treeData.iconCls,
							store : Ext.create('Ext.data.TreeStore', {
										model : 'SCM.model.MenuModel',
										autoLoad : false,
										autoSync : true,
										proxy : {
											type : 'ajax',
											url : '../scm/control/getTreeDataByParentId?flag=true&parentId=' + treeData.id
										},
										sorters : [{//根据sort字段排序
											property : 'sort',
											direction : 'ASC'
										}]
									}),
							listeners : {
								itemclick : function(tree, record) {//在页面展示区域增加tab
									if (!self.getTabpanel().hasTab(record.data)) {//判断页面是否已经打开
										Ext.Ajax.request({
													url : '../scm/control/getUserPermissions?menuId=' + record.get("id"),
													success : function(response, option) {
														var permission = Ext.decode(response.responseText);
														//var permission = Ext.decode("{edit: true,add: true,remove: true,view:false}");
														self.getTabpanel().addTab(record.data, permission);
													}
												});
									} else {
										self.getTabpanel().setActiveTab(record.get("id"));
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
					url : '../scm/control/logout',
					success : function(response, option) {
						Ext.Msg.alert("提示", "你已经注销！", new Function("window.location = window.location;"));
					}
				});
			},
			downloadHelp : function() {
				window.location = '../scmui/help/help.doc';
			}
		})