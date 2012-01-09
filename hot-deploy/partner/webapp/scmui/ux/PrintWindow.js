Ext.define('Ext.ux.PrintWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.uxprinter',
    height: 438,
    width: 617,
    title: '打印设置',
    maximized: true,

    initComponent: function() {
        var me = this;

        me.callParent(arguments);
    }
    
});