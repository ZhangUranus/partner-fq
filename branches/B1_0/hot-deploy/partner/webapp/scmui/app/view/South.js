/**
 * @Purpose 系统底部容器
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define('SCM.view.South', {
			extend : 'Ext.Toolbar',
			alias : 'widget.south',
			initComponent : function() {
				Ext.apply(this, {
							id : 'bottom',
							// frame:true,
							region : 'south',
							height : 23,
							items : ["系统期间:", {
										xtype : 'label',
										id : 'current-date-label',
										margin : '0 30 0 0',
										text : '无',
										style : {
											'font-weight' : 'bold',
											'font-size' : 12,
											'color' : 'blue'
										}
									}, "您好!", {
										xtype : 'label',
										id : 'current-user-label',
										text : '未登录',
										style : {
											'text-decoration' : 'underline',
											'font-weight' : 'bold',
											'color' : 'blue'
										}
									}, {
										xtype : 'button',
										action : 'logout',
										margin : '0 5 0 15',
										iconCls : 'system-logout',
										text : '注销'
									}, {
										xtype : 'button',
										action : 'help',
										margin : '0 0 0 0',
										iconCls : 'system-help',
										text : '下载帮助文档'
									}, '->', "Partner 2012 copyright"]
						});
				this.callParent(arguments);
			}
		})