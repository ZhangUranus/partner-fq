/**
 * @Purpose 系统菜单容器
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.view.Menu', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.menu',
			initComponent : function() {
				Ext.apply(this, {
							id : 'main-tree',
							margins : '0 0 -1 1',
							layout : 'accordion',
							region : 'west',
							border : false,
							enableDD : false,
							split : true,
							width : 212,
							minSize : 130,
							maxSize : 300,
							rootVisible : false,
							containerScroll : true,
							collapsible : true,
							autoScroll : false
						});
				this.callParent(arguments);
			}
		})