/**
 * @Purpose “页面未开发”提示页面
 * @author jeff-liu
 * @Date 2011-11-24
 */
Ext.define("SCM.view.main.PageError", {
		extend : "Ext.container.Container",
		alias : "widget.pageerror",
		html : '<label><font size="4" color="red">'+LocaleLang.pageUndeveloped+'</font></label>',
		initComponent : function() {
			this.callParent(arguments)
		}
	}
);