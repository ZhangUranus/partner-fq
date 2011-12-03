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
							id : "bottom",
							//frame:true,
							region : "south",
							height : 23,
							items : ["当前用户：Guest", '->', "copyright"]
						});
				this.callParent(arguments);
			}
		})