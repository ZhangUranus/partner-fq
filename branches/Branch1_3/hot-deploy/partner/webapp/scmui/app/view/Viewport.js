/**
 * @Purpose 系统主框架展示类
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.view.Viewport', {
			extend : 'Ext.Viewport',
			alias : 'widget.viewport',
			layout : 'fit',
			hideBorders : true,
			requires : ['SCM.view.Header', 'SCM.view.Menu', 'SCM.view.TabPanel', 'SCM.view.South'],
			initComponent : function() {
				var me = this;
				Ext.apply(me, {
							items : [{
										id : 'main-view',
										layout : 'border',
										items : [Ext.create('SCM.view.Header'), Ext.create('SCM.view.Menu'), Ext.create('SCM.view.TabPanel'), Ext.create('SCM.view.South')],
										listeners : {//监控 改变浏览器大小 事件，调用重新计算布局，刷新布局。
											resize : function() {
												me.doLayout();
											}
										}
									}]
						});
				me.callParent(arguments);
			}
		})