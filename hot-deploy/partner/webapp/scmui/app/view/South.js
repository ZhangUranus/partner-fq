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
							items : ["当前用户：",{
										xtype : 'label',
										id : 'current-user-label',
										text : '未登录',
										style : {
											'text-decoration': 'underline',
											'font-weight': 'bold',
											'color': 'blue'
										}
									}, '->', "Partner 2012 copyright"]
						});
				this.callParent(arguments);
			}
		})